// ========================================================
// SINGLE PAGE APP - VIEW SWITCHING
// ========================================================

function switchView(viewId) {
    const views = document.querySelectorAll('.page-view');
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (viewId === 'view-home') {
        history.replaceState(null, null, ' ');
    }
}

// ========================================================
// DASHBOARD SUBVIEW SWITCHING
// ========================================================

function showDashboardSection(sectionId) {
    const sections = document.querySelectorAll('.dashboard-subview');
    sections.forEach(sec => {
        sec.classList.add('hidden');
    });
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
    }
}

// ========================================================
// CUSTOM ALERT / MESSAGE BOX
// ========================================================

function showMessage(msg) {
    const alertBox = document.getElementById('custom-alert');
    if (!alertBox) return;
    alertBox.innerText = msg;
    alertBox.classList.remove('opacity-0', 'pointer-events-none');
    
    setTimeout(() => {
        alertBox.classList.add('opacity-0', 'pointer-events-none');
    }, 3500);
}

// ========================================================
// LOADING SCREEN
// ========================================================

window.onload = function() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
};

// ========================================================
// MOBILE MENU TOGGLE
// ========================================================

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
}

// ========================================================
// FAQ ACCORDION
// ========================================================

function toggleFaq(id) {
    const content = document.getElementById(`faq-content-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);
    
    if (!content || !icon) return;
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// ========================================================
// STICKY NAVBAR ON SCROLL
// ========================================================

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'bg-zinc-950/90');
        navbar.classList.remove('glass');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-zinc-950/90');
        navbar.classList.add('glass');
    }
});

// ========================================================
// SERVER PANEL SIMULATION
// ========================================================

let isServerOnline = true;
let consoleInterval = null;
let statsInterval = null;

function openServerPanel(name, ip, ram) {
    showDashboardSection('dashboard-server-panel');
    const nameEl = document.getElementById('panel-server-name');
    const ipEl = document.getElementById('panel-server-ip');
    if (nameEl) nameEl.innerText = name;
    if (ipEl) ipEl.innerText = ip;
    
    startStatsSimulation();
    startConsoleSimulation();
}

function closeServerPanel() {
    showDashboardSection('dashboard-servers');
    stopSimulations();
}

function switchPanelTab(tabId) {
    const tabs = document.querySelectorAll('.panel-tab-content');
    tabs.forEach(t => t.classList.add('hidden'));
    
    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');
    
    const btnConsole = document.getElementById('btn-tab-console');
    const btnFiles = document.getElementById('btn-tab-files');
    const btnPlugins = document.getElementById('btn-tab-plugins');
    
    if (btnConsole) btnConsole.className = "px-4 py-2 text-zinc-400 hover:text-white text-sm whitespace-nowrap";
    if (btnFiles) btnFiles.className = "px-4 py-2 text-zinc-400 hover:text-white text-sm whitespace-nowrap";
    if (btnPlugins) btnPlugins.className = "px-4 py-2 text-zinc-400 hover:text-white text-sm whitespace-nowrap";
    
    if (tabId === 'panel-tab-console' && btnConsole) {
        btnConsole.className = "px-4 py-2 border-b-2 border-brand-orange text-white font-bold text-sm whitespace-nowrap";
    } else if (tabId === 'panel-tab-files' && btnFiles) {
        btnFiles.className = "px-4 py-2 border-b-2 border-brand-orange text-white font-bold text-sm whitespace-nowrap";
    } else if (tabId === 'panel-tab-plugins' && btnPlugins) {
        btnPlugins.className = "px-4 py-2 border-b-2 border-brand-orange text-white font-bold text-sm whitespace-nowrap";
    }
}

function controlServerState(action) {
    const statusLabel = document.getElementById('panel-server-status');
    const cardStatusLabel = document.getElementById('card-status-label');
    const logsContainer = document.getElementById('console-logs');

    if (action === 'stop') {
        isServerOnline = false;
        if (statusLabel) {
            statusLabel.innerText = "متوقف";
            statusLabel.className = "px-2.5 py-0.5 bg-red-900/40 text-red-400 border border-red-800 text-xs rounded-full font-bold";
        }
        if (cardStatusLabel) {
            cardStatusLabel.innerText = "متوقف";
            cardStatusLabel.className = "font-bold text-red-400";
        }
        
        if (logsContainer) {
            logsContainer.innerHTML += `<div class="text-red-500">[17:05:00 WARN]: Stopping server by user request...</div>`;
            logsContainer.innerHTML += `<div class="text-zinc-500">[17:05:01 INFO]: Saving chunks for level 'world'</div>`;
            logsContainer.innerHTML += `<div class="text-red-500">[17:05:02 INFO]: Server shut down.</div>`;
            logsContainer.scrollTop = logsContainer.scrollHeight;
        }
        
        const cpuVal = document.getElementById('cpu-stat-val');
        const cpuBar = document.getElementById('cpu-stat-bar');
        const ramVal = document.getElementById('ram-stat-val');
        const ramBar = document.getElementById('ram-stat-bar');
        
        if (cpuVal) cpuVal.innerText = "0%";
        if (cpuBar) cpuBar.style.width = "0%";
        if (ramVal) ramVal.innerText = "0 GB";
        if (ramBar) ramBar.style.width = "0%";
        
        showMessage('تم إرسال إشارة الإيقاف بنجاح.');
    } else if (action === 'start') {
        if (isServerOnline) {
            showMessage('السيرفر يعمل بالفعل حالياً.');
            return;
        }
        isServerOnline = true;
        if (statusLabel) {
            statusLabel.innerText = "جاري التشغيل...";
            statusLabel.className = "px-2.5 py-0.5 bg-yellow-900/40 text-yellow-400 border border-yellow-800 text-xs rounded-full font-bold";
        }
        
        setTimeout(() => {
            if (statusLabel) {
                statusLabel.innerText = "يعمل";
                statusLabel.className = "px-2.5 py-0.5 bg-green-900/40 text-green-400 border border-green-800 text-xs rounded-full font-bold";
            }
            if (cardStatusLabel) {
                cardStatusLabel.innerText = "يعمل الآن";
                cardStatusLabel.className = "font-bold text-green-400";
            }
            if (logsContainer) {
                logsContainer.innerHTML += `<div class="text-green-500">[17:05:30 INFO]: Loaded 0 recipes</div>`;
                logsContainer.innerHTML += `<div class="text-brand-gold">[17:05:32 INFO]: Done! Ready for players connection.</div>`;
                logsContainer.scrollTop = logsContainer.scrollHeight;
            }
        }, 3000);
        
        showMessage('جاري بدء تشغيل السيرفر...');
    } else if (action === 'restart') {
        controlServerState('stop');
        setTimeout(() => {
            controlServerState('start');
        }, 2000);
    }
}

function startStatsSimulation() {
    if (statsInterval) clearInterval(statsInterval);
    statsInterval = setInterval(() => {
        if (!isServerOnline) return;
        
        const cpuValEl = document.getElementById('cpu-stat-val');
        const cpuBarEl = document.getElementById('cpu-stat-bar');
        const ramValEl = document.getElementById('ram-stat-val');
        const ramBarEl = document.getElementById('ram-stat-bar');
        
        if (cpuValEl && cpuBarEl) {
            const cpuVal = (15 + Math.random() * 35).toFixed(1);
            cpuValEl.innerText = cpuVal + "%";
            cpuBarEl.style.width = cpuVal + "%";
        }
        
        if (ramValEl && ramBarEl) {
            const ramVal = (1.1 + Math.random() * 0.3).toFixed(2);
            ramValEl.innerText = ramVal + " GB";
            const pct = ((ramVal / 2.0) * 100).toFixed(0);
            ramBarEl.style.width = pct + "%";
        }
    }, 2500);
}

function submitConsoleCommand() {
    const cmdInput = document.getElementById('console-cmd-input');
    if (!cmdInput) return;
    const cmd = cmdInput.value.trim();
    if (!cmd) return;
    
    const logsContainer = document.getElementById('console-logs');
    if (!logsContainer) return;
    logsContainer.innerHTML += `<div class="text-zinc-300">&gt; ${cmd}</div>`;
    
    if (!isServerOnline) {
        logsContainer.innerHTML += `<div class="text-red-500">[CONSOLE ERROR]: Cannot dispatch command while server is offline!</div>`;
    } else {
        if (cmd.toLowerCase().startsWith('op ')) {
            const user = cmd.substring(3);
            logsContainer.innerHTML += `<div class="text-brand-gold">[17:06:01 INFO]: Opped ${user}</div>`;
        } else if (cmd.toLowerCase().startsWith('say ')) {
            const msg = cmd.substring(4);
            logsContainer.innerHTML += `<div class="text-zinc-300">[17:06:01 INFO]: [Server] ${msg}</div>`;
        } else {
            logsContainer.innerHTML += `<div class="text-zinc-500">[17:06:01 INFO]: Dispatched command: ${cmd}</div>`;
        }
    }
    
    cmdInput.value = '';
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function startConsoleSimulation() {
    if (consoleInterval) clearInterval(consoleInterval);
    const logsContainer = document.getElementById('console-logs');
    if (!logsContainer) return;
    
    consoleInterval = setInterval(() => {
        if (!isServerOnline) return;
        
        const events = [
            "[17:07:11 INFO]: Saved the world database files.",
            "[17:08:24 INFO]: Ahmad_Gamer issued server command: /tpa",
            "[17:09:40 INFO]: Running automatic backup chunk synchronization...",
            "[17:10:15 INFO]: Backup compiled successfully."
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        logsContainer.innerHTML += `<div class="text-zinc-500">${randomEvent}</div>`;
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }, 10000);
}

function stopSimulations() {
    if (statsInterval) clearInterval(statsInterval);
    if (consoleInterval) clearInterval(consoleInterval);
}

function triggerFileUpload() {
    const input = document.getElementById('dashboard-file-upload-input');
    if (input) input.click();
}

function mockFileUploaded() {
    showMessage('تم رفع وتثبيت الملف بنجاح! يظهر الآن بمدير الملفات.');
}

function updateOrderPrice() {
    const planSelect = document.getElementById('order-plan-select');
    if (!planSelect) return;
    const price = parseInt(planSelect.value);
    const planName = planSelect.options[planSelect.selectedIndex].text.split(' - ')[0];
    
    const summaryName = document.getElementById('summary-plan-name');
    const summaryBase = document.getElementById('summary-base-price');
    const summaryTotal = document.getElementById('summary-total-price');
    
    if (summaryName) summaryName.innerText = "خطة ماين كرافت (" + planName + ")";
    if (summaryBase) summaryBase.innerText = "$" + price + ".00";
    if (summaryTotal) summaryTotal.innerText = "$" + price + ".00";
}

function processOrderCheckout() {
    const planSelect = document.getElementById('order-plan-select');
    if (!planSelect) return;
    const price = parseInt(planSelect.value);
    
    if (price === 0) {
        showMessage('تم تفعيل خطتك التجريبية المجانية بنجاح! جاري إعداد وتجهيز السيرفر...');
        setTimeout(() => {
            window.location.href = 'pages/dashboard.html';
        }, 2000);
    } else {
        showMessage('تم توجيهك الآن آلياً لبوابة استقبال المدفوعات الآمنة...');
    }
}