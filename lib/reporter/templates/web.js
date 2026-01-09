export function renderWebTemplate(data, metrics) {
    return `
    <div class="mb-12">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <i data-lucide="monitor" class="w-3 h-3"></i> Frontend Experience Analysis
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
            ${renderSmallStat("Avg Load Time", metrics.http_req_duration ? metrics.http_req_duration.values.avg.toFixed(0) + "ms" : "0")}
            ${renderSmallStat("Success Rate", (100 - (metrics.http_req_failed ? metrics.http_req_failed.values.rate * 100 : 0)).toFixed(1) + "%")}
            ${renderSmallStat("Bandwidth", metrics.data_received ? (metrics.data_received.values.rate / 1024).toFixed(1) + " KB/s" : "0")}
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
