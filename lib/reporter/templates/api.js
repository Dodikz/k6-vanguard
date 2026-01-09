export function renderAPITemplate(data, metrics) {
    return `
    <div class="mb-12">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <i data-lucide="server" class="w-3 h-3"></i> Backend API Insights
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
            ${renderSmallStat("Availability", (100 - (metrics.http_req_failed ? metrics.http_req_failed.values.rate * 100 : 0)).toFixed(2) + "%")}
            ${renderSmallStat("Throughput", metrics.http_reqs ? metrics.http_reqs.values.rate.toFixed(1) + " req/s" : "0")}
            ${renderSmallStat("Avg Payload", metrics.data_received ? (metrics.data_received.values.count / (metrics.http_reqs ? metrics.http_reqs.values.count : 1) / 1024).toFixed(2) + " KB" : "0")}
            ${renderSmallStat("Total Traffic", metrics.data_received ? (metrics.data_received.values.count / 1024 / 1024).toFixed(2) + " MB" : "0")}
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
