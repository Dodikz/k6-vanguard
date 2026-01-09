export function renderScenarioTemplate(data, metrics) {
    return `
    <div class="mb-12 animate-in slide-in-from-left duration-500">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <i data-lucide="cloud-lightning" class="w-3 h-3"></i> Resiliency & Chaos Scenario
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
            ${renderSmallStat("Max Stability", (100 - (metrics.http_req_failed ? metrics.http_req_failed.values.rate * 100 : 0)).toFixed(2) + "%")}
            ${renderSmallStat("Peak VUs", metrics.vus ? metrics.vus.value : 0)}
            ${renderSmallStat("Iteration Rate", metrics.iterations ? metrics.iterations.values.rate.toFixed(1) + "/s" : "0")}
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
