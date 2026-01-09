import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.2/index.js";
import { BaseStyles, ThemeScript, renderHeader, renderFooter } from "./base.js";
import { renderAPITemplate } from "./templates/api.js";
import { renderWebTemplate } from "./templates/web.js";
import { renderPerfTemplate } from "./templates/performance.js";
import { renderProtocolTemplate } from "./templates/protocol.js";
import { renderScenarioTemplate } from "./templates/scenarios.js";


export function generateReports(data, testName = "Performance Test") {
    const timestamp = new Date().toLocaleString();
    

    const metrics = data.metrics;
    const totalRequests = metrics.http_reqs ? metrics.http_reqs.values.count : 0;
    const failedRequests = metrics.http_req_failed ? metrics.http_req_failed.values.passes : 0;
    const totalChecks = countTotalChecks(data.root_group);
    const failedChecks = countFailedChecks(data.root_group);
    const breachedThresholds = countBreachedThresholds(metrics);
    
    const isFailed = breachedThresholds > 0 || failedRequests > 0;
    
    let targetUrl = "https://example.com";
    if (data.metadata && data.metadata.url) {
        targetUrl = data.metadata.url;
    } else if (__ENV.BASE_URL) {
        targetUrl = __ENV.BASE_URL;
    } else if (__ENV.API_URL) {
        targetUrl = __ENV.API_URL;
    }

    let categoryOverview = "";
    const lowerName = testName.toLowerCase();
    
    if (lowerName.includes('api') || lowerName.includes('graphql') || lowerName.includes('cookie')) {
        categoryOverview = renderAPITemplate(data, metrics);
    } else if (lowerName.includes('web') || lowerName.includes('front')) {
        categoryOverview = renderWebTemplate(data, metrics);
    } else if (lowerName.includes('websocket') || lowerName.includes('ws') || lowerName.includes('protocol')) {
        categoryOverview = renderProtocolTemplate(data, metrics);
    } else if (lowerName.includes('chaos') || lowerName.includes('scenario')) {
        categoryOverview = renderScenarioTemplate(data, metrics);
    } else {
        categoryOverview = renderPerfTemplate(data, metrics);
    }

    const durationValues = metrics.http_req_duration ? metrics.http_req_duration.values : { avg: 0, 'p(90)': 0, 'p(95)': 0, max: 0 };

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${testName} | Report</title>
        ${BaseStyles}
        ${ThemeScript}
    </head>
    <body class="bg-white dark:bg-darkBg text-slate-800 dark:text-slate-400 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
        <div class="main-wrapper">
            <div class="max-w-6xl mx-auto px-6 py-12">
                ${renderHeader(testName, isFailed, timestamp, targetUrl)}
                
                <!-- OVERVIEW TAB -->
                <div id="overview" class="tab-content active">
                    ${categoryOverview}
                    
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
                        <div class="lg:col-span-3">
                            <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                <i data-lucide="line-chart" class="w-3 h-3"></i> Latency Distribution
                            </h2>
                            <div class="chart-container">
                                <canvas id="latencyChart"></canvas>
                            </div>
                        </div>
                        <div class="flex flex-col gap-10 lg:pt-10">
                            ${renderVerticalStat("Avg Response", durationValues.avg.toFixed(1) + " ms")}
                            ${renderVerticalStat("P(95) Stability", durationValues['p(95)'].toFixed(1) + " ms")}
                            ${renderVerticalStat("Success Rate", (100 - (metrics.http_req_failed ? metrics.http_req_failed.values.rate * 100 : 0)).toFixed(2) + "%")}
                        </div>
                    </div>

                </div>

                <!-- METRICS TAB -->
                <div id="metrics" class="tab-content">
                    <div class="overflow-x-auto rounded border border-slate-100 dark:border-slate-800/50">
                        <table class="w-full text-left table-clean border-collapse">
                            <thead>
                                <tr>
                                    <th>METRIC IDENTIFIER</th>
                                    <th>AVERAGE</th>
                                    <th>P(90)</th>
                                    <th class="text-accent">P(95)</th>
                                    <th class="text-right">MAXIMUM</th>
                                </tr>
                            </thead>
                            <tbody class="font-mono">
                                ${renderMetricRows(metrics)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- DETAILS TAB -->
                <div id="details" class="tab-content">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 px-4">
                        ${renderSummaryCard("Total Requests", totalRequests)}
                        ${renderSummaryCard("Failed Requests", failedRequests, failedRequests > 0)}
                        ${renderSummaryCard("Breached Thresholds", breachedThresholds, breachedThresholds > 0)}
                        ${renderSummaryCard("Failed Checks", failedChecks, failedChecks > 0)}
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div class="space-y-12">
                            <section>
                                <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Traffic & Infrastructure</h3>
                                <div class="space-y-5">
                                    ${renderDetailRow("Request Rate", (metrics.http_reqs ? metrics.http_reqs.values.rate.toFixed(2) : 0) + " req/sec")}
                                    ${renderDetailRow("Total Iterations", metrics.iterations ? metrics.iterations.values.count : 0)}
                                    ${renderDetailRow("Data Received", metrics.data_received ? (metrics.data_received.values.count / 1024 / 1024).toFixed(3) + " MB" : "0 MB")}
                                    ${renderDetailRow("Data Sent", metrics.data_sent ? (metrics.data_sent.values.count / 1024).toFixed(2) + " KB" : "0 KB")}
                                    ${renderDetailRow("Virtual Users (VUs)", metrics.vus ? metrics.vus.value : 0)}
                                </div>
                            </section>
                            <section>
                                <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">SLA Constraints</h3>
                                <div class="grid grid-cols-1 gap-y-3 font-mono text-[11px]">
                                    ${renderThresholdList(metrics)}
                                </div>
                            </section>
                        </div>
                        <section>
                            <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">System Runtime Info</h3>
                            <div class="p-8 bg-slate-50/50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800/50 text-[11px] leading-relaxed">
                                <pre class="whitespace-pre-wrap text-slate-500 dark:text-slate-400 opacity-80">${JSON.stringify(data.state, null, 4)}</pre>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- CHECKS TAB -->
                <div id="checks" class="tab-content">
                    <div class="max-w-4xl mx-auto space-y-3">
                        <div class="flex items-center justify-between mb-8">
                            <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Assertion Registry</h3>
                            <span class="text-[10px] font-bold text-slate-400">${totalChecks} Checks Active</span>
                        </div>
                        ${renderChecksList(data.root_group)}
                        ${totalChecks === 0 ? '<p class="text-center py-20 text-slate-400 italic text-sm opacity-50">No assertions defined for this scenario</p>' : ''}
                    </div>
                </div>
            </div>
        </div>

        ${renderFooter()}

        <script>
            lucide.createIcons();
            let latencyChart;

            function initChart() {
                const ctx = document.getElementById('latencyChart').getContext('2d');
                const isDark = document.documentElement.classList.contains('dark');
                const gridColor = isDark ? '#0f172a' : '#f8f9fa';
                const labelColor = isDark ? '#475569' : '#94a3b8';
                
                if (latencyChart) latencyChart.destroy();

                const dur = ${JSON.stringify(durationValues)};
                const dataPoints = [dur.avg, dur['p(90)'], dur['p(95)'], dur.max];
                
                // Dynamic Coloring based on latency intensity
                const colors = dataPoints.map(v => {
                    if (v < 200) return isDark ? '#10b981' : '#059669'; // Excellent (Green)
                    if (v < 500) return isDark ? '#6366f1' : '#0f172a'; // Good (Indigo/Black)
                    if (v < 1000) return '#f59e0b'; // Warning (Amber)
                    return '#ef4444'; // Critical (Red)
                });

                latencyChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Average', 'P(90)', 'P(95)', 'Maximum'],
                        datasets: [{
                            data: dataPoints,
                            backgroundColor: colors,
                            borderRadius: 2,
                            barThickness: 44
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: { padding: { top: 20 } },
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { 
                                grid: { color: gridColor, drawBorder: false }, 
                                ticks: { 
                                    color: labelColor, 
                                    font: { family: 'JetBrains Mono', size: 10 },
                                    callback: (v) => v + ' ms',
                                    padding: 12
                                } 
                            },
                            x: { 
                                grid: { display: false }, 
                                ticks: { color: labelColor, font: { family: 'Inter', size: 10 }, padding: 12 } 
                            }
                        }
                    }
                });
            }

            window.addEventListener('theme-changed', initChart);
            window.addEventListener('tab-changed', () => {
                const overview = document.getElementById('overview');
                if (overview && overview.classList.contains('active')) {
                    initChart();
                }
            });
            initChart();
        </script>
    </body>
    </html>
    `;

    let subfolder = "general";
    if (lowerName.includes('api') || lowerName.includes('graphql') || lowerName.includes('cookie')) subfolder = "api";
    else if (lowerName.includes('web') || lowerName.includes('front')) subfolder = "web";
    else if (lowerName.includes('perf') || lowerName.includes('load') || lowerName.includes('stress') || lowerName.includes('spike') || lowerName.includes('soak')) subfolder = "performance";
    else if (lowerName.includes('websocket') || lowerName.includes('ws') || lowerName.includes('grpc') || lowerName.includes('protocol')) subfolder = "protocol";
    else if (lowerName.includes('chaos') || lowerName.includes('scenario')) subfolder = "scenarios";
    
    if (lowerName.includes('default')) subfolder = "defaults/" + subfolder;

    const reportPath = `reports/${subfolder}/${testName.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.html`;

    return {
        stdout: textSummary(data, { indent: " ", enableColors: true }),
        [reportPath]: html,
    };
}

function renderVerticalStat(label, value) {
    return `
    <div class="stat-card border-l-2 border-slate-100 dark:border-slate-800 pl-6 pb-2">
        <p class="text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-2">${label}</p>
        <p class="text-2xl font-medium dark:text-white tracking-tight">${value}</p>
    </div>
    `;
}

function renderSummaryCard(label, value, isAlert = false) {
    return `
    <div class="animate-in fade-in duration-1000">
        <p class="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-3">${label}</p>
        <p class="text-2xl font-bold ${isAlert ? 'text-rose-500' : 'dark:text-white'}">${value}</p>
    </div>
    `;
}

function renderDetailRow(label, value) {
    return `
    <div class="flex justify-between items-baseline border-b border-slate-50 dark:border-slate-900 pb-3 hover:border-slate-100 dark:hover:border-slate-800 transition-colors">
        <span class="text-[11px] font-medium text-slate-400 tracking-wide">${label}</span>
        <span class="text-xs font-bold dark:text-slate-200 font-mono tracking-tight">${value}</span>
    </div>
    `;
}

function renderMetricRows(metrics) {
    const items = [
        { l: "Iteration Loop", k: "iteration_duration" },
        { l: "Total Request", k: "http_req_duration" },
        { l: "Waiting (TTFB)", k: "http_req_waiting" },
        { l: "Establishing Connection", k: "http_req_connecting" },
        { l: "TLS Handshaking", k: "http_req_tls_handshaking" },
        { l: "Uploading Data", k: "http_req_sending" },
        { l: "Downloading Payload", k: "http_req_receiving" }
    ];
    return items.map(i => {
        const m = metrics[i.k];
        if (!m) return "";
        return `
            <tr>
                <td class="text-slate-400 font-sans font-medium uppercase text-[9px] tracking-[0.15em] py-5">${i.l}</td>
                <td class="opacity-80">${m.values.avg.toFixed(2)} ms</td>
                <td class="opacity-60">${m.values['p(90)'].toFixed(2)} ms</td>
                <td class="font-bold text-slate-900 dark:text-slate-200">${m.values['p(95)'].toFixed(2)} ms</td>
                <td class="text-right opacity-30">${m.values.max.toFixed(2)} ms</td>
            </tr>
        `;
    }).join("");
}

function renderChecksList(group) {
    let html = "";
    if (group.checks) {
        group.checks.forEach(c => {
            const pass = c.fails === 0;
            html += `
            <div class="group flex items-center justify-between py-4 border-b border-slate-50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 px-4 rounded-lg transition-all">
                <div class="flex items-center gap-4">
                    <i data-lucide="${pass ? 'check-circle-2' : 'alert-circle'}" class="w-4 h-4 ${pass ? 'text-emerald-500/60' : 'text-rose-500'}"></i>
                    <span class="text-[11px] font-semibold tracking-wide ${pass ? 'text-slate-600 dark:text-slate-400' : 'text-rose-500'}">${c.name}</span>
                </div>
                <div class="flex items-center gap-6">
                    <div class="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full ${pass ? 'bg-emerald-500/40' : 'bg-rose-500'}" style="width: ${(c.passes/(c.passes+c.fails)*100).toFixed(0)}%"></div>
                    </div>
                    <span class="font-mono text-[10px] opacity-40 tabular-nums">${c.passes} / ${c.passes+c.fails}</span>
                </div>
            </div>`;
        });
    }
    if (group.groups) group.groups.forEach(g => html += renderChecksList(g));
    return html;
}

function renderThresholdList(metrics) {
    let html = "";
    Object.keys(metrics).forEach(mName => {
        const m = metrics[mName];
        if (m.thresholds) {
            Object.keys(m.thresholds).forEach(tName => {
                const t = m.thresholds[tName];
                html += `
                <div class="flex items-center gap-4 py-2 opacity-80 group transition-opacity hover:opacity-100">
                    <i data-lucide="${t.ok ? 'check-square' : 'alert-triangle'}" class="${t.ok ? 'text-emerald-500/50' : 'text-rose-500'} w-3.5 h-3.5"></i>
                    <span class="text-slate-500 w-32 flex-shrink-0 truncate uppercase text-[9px] font-black tracking-widest">${mName}</span>
                    <span class="text-slate-300 flex-grow truncate" title="${tName}">${tName}</span>
                </div>`;
            });
        }
    });
    return html || '<p class="text-slate-500 italic py-4">No specific thresholds defined</p>';
}

function countTotalChecks(group) {
    let count = (group.checks || []).length;
    (group.groups || []).forEach(g => count += countTotalChecks(g));
    return count;
}

function countFailedChecks(group) {
    let count = (group.checks || []).filter(c => c.fails > 0).length;
    (group.groups || []).forEach(g => count += countFailedChecks(g));
    return count;
}

function countBreachedThresholds(metrics) {
    let count = 0;
    Object.values(metrics).forEach(m => {
        if (m.thresholds) {
            Object.values(m.thresholds).forEach(t => { if (!t.ok) count++; });
        }
    });
    return count;
}
