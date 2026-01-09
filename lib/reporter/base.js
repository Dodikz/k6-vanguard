export const BaseStyles = `
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        darkBg: '#050505',
                        accent: '#6366f1',
                    }
                }
            }
        }
    </script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="../assets/favicon.ico">
    <style>
        html, body { height: 100%; margin: 0; }
        body { 
            display: flex;
            flex-direction: column;
            transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s; 
        }
        .main-wrapper { flex: 1 0 auto; }
        .footer-wrapper { flex-shrink: 0; }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.4s ease-out; }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .tab-btn { position: relative; color: #94a3b8; transition: all 0.2s ease; padding-bottom: 0.75rem; }
        .tab-btn:hover { color: #64748b; }
        .dark .tab-btn:hover { color: #cbd5e1; }
        .tab-btn.active { color: #0f172a; }
        .dark .tab-btn.active { color: #f8fafc; }
        .tab-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: #6366f1;
            transition: width 0.2s ease;
        }
        .tab-btn.active::after { width: 100%; }

        .table-clean th { 
            text-align: left;
            font-size: 10px; 
            font-weight: 600; 
            letter-spacing: 0.05em; 
            color: #64748b; 
            padding: 1rem; 
            border-bottom: 1px solid #e2e8f0; 
        }
        .dark .table-clean th { border-bottom-color: #1e293b; color: #94a3b8; }
        .table-clean td { padding: 1rem; font-size: 12px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
        .table-clean tr:hover td { background: rgba(241, 117, 117, 0.02); }
        .dark .table-clean tr:hover td { background: rgba(255, 255, 255, 0.01); }
        .dark .table-clean td { border-bottom-color: #0f172a; color: #cbd5e1; }
        
        .chart-container { position: relative; height: 350px; width: 100%; }
        
        .stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .stat-card:hover { transform: translateY(-2px); }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark ::-webkit-scrollbar-thumb { background: #1e293b; }
    </style>
`;

export const ThemeScript = `
    <script>
        function toggleTheme() {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            window.dispatchEvent(new Event('theme-changed'));
        }

        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
            window.dispatchEvent(new Event('tab-changed'));
        }

        (function() {
            const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.add(savedTheme);
        })();
    </script>
`;

export function renderHeader(testName, isFailed, timestamp, targetUrl) {
    return `
    <nav class="flex items-center justify-between mb-8 pb-4 animate-in fade-in slide-in-from-top-2 duration-700">
        <div class="flex items-baseline gap-4">
            <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">${testName}</h1>
            <span class="text-[11px] font-medium text-slate-400 uppercase tracking-widest opacity-60">${timestamp}</span>
        </div>
        <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest transition-all">
                <span class="w-2 h-2 rounded-full ${isFailed ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}"></span>
                <span class="dark:text-slate-400">${isFailed ? 'System Breached' : 'System Healthy'}</span>
            </div>
            <button onclick="toggleTheme()" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all transform hover:rotate-12">
                <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
                <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
            </button>
        </div>
    </nav>

    <div class="mb-10 animate-in fade-in duration-1000">
        <p class="text-[12px] text-slate-400 flex items-center gap-2.5">
            <i data-lucide="link-2" class="w-3.5 h-3.5"></i>
            Link Test: <a href="${targetUrl}" class="text-slate-600 dark:text-slate-300 hover:text-accent font-medium underline underline-offset-4 decoration-slate-200 dark:decoration-slate-800 transition-colors" target="_blank">${targetUrl}</a>
        </p>
    </div>

    <div class="flex items-center gap-10 mb-12 border-b border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button onclick="switchTab('overview')" class="tab-btn active text-sm font-medium">Overview</button>
        <button onclick="switchTab('metrics')" class="tab-btn text-sm font-medium">Technical Metrics</button>
        <button onclick="switchTab('details')" class="tab-btn text-sm font-medium">Execution Details</button>
        <button onclick="switchTab('checks')" class="tab-btn text-sm font-medium">Verification</button>
    </div>
    `;
}

export function renderFooter() {
    return `
    <div class="footer-wrapper">
        <div class="max-w-6xl mx-auto px-6">
            <div class="mt-24 border-t border-slate-200 dark:border-slate-800"></div>
            <footer class="py-16 text-center">
                <p class="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-4 italic tracking-widest">
                    <span>&copy; 2026 Advanced K6 Tester Tooling • Built for Engineers</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                    <a href="https://github.com/Dodikz" target="_blank" class="text-slate-500 hover:text-accent transition-all font-bold lowercase flex items-center gap-1">
                        <i data-lucide="github" class="w-3 h-3"></i>
                        github
                    </a>
                </p>
            </footer>
        </div>
    </div>
    `;
}
