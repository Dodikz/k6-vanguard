export function renderPerfTemplate(data, metrics) {
    return `
    <div class="mb-12">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <i data-lucide="zap" class="w-3 h-3"></i> High-Capacity Stress Report
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
            ${renderSmallStat("Peak VUs", metrics.vus ? metrics.vus.value : 0)}
            ${renderSmallStat("Max Latency", (metrics.http_req_duration ? metrics.http_req_duration.values.max : 0).toFixed(0) + "ms")}
            ${renderSmallStat("Data Volume", metrics.data_received ? (metrics.data_received.values.count / 1024 / 1024).toFixed(1) + " MB" : "0")}
        </div>
    </div>
    `;
}

function renderSmallStat(label, value) {
    return `
    <div>
        <p class="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-2">${label}</p>
        <p class="text-lg font-medium dark:text-white">${value}</p>
    </div>
    `;
}
