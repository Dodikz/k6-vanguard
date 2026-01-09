export function renderProtocolTemplate(data, metrics) {
    return `
    <div class="mb-12 animate-in slide-in-from-left duration-500">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <i data-lucide="share-2" class="w-3 h-3"></i> Protocol & Connection Analysis
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
            ${renderSmallStat("Handshake", metrics.http_req_tls_handshaking ? metrics.http_req_tls_handshaking.values.avg.toFixed(2) + "ms" : "0ms")}
            ${renderSmallStat("Connection", metrics.http_req_connecting ? metrics.http_req_connecting.values.avg.toFixed(2) + "ms" : "0ms")}
            ${renderSmallStat("Waiting (TTFB)", metrics.http_req_waiting ? metrics.http_req_waiting.values.avg.toFixed(2) + "ms" : "0ms")}
            ${renderSmallStat("Data Rate", metrics.data_received ? (metrics.data_received.values.rate / 1024).toFixed(1) + " KB/s" : "0")}
        </div>
    </div>
    `;
}

function renderSmallStat(label, value) {
    return `
    <div class="transition-all hover:translate-y-[-2px]">
        <p class="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-2">${label}</p>
        <p class="text-lg font-medium dark:text-white">${value}</p>
    </div>
    `;
}
