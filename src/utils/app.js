// ProductCoCreate AI - 应用主文件

// 应用配置
const AppConfig = {
    apiBaseUrl: '/api',
    version: '1.0.0',
    appName: 'ProductCoCreate AI'
};

// 应用初始化
function initializeApp() {
    console.log(`${AppConfig.appName} v${AppConfig.version} 初始化中...`);

    // 初始化事件监听器
    setupEventListeners();

    // 加载用户数据
    loadUserData();

    console.log('应用初始化完成');
}

// 设置事件监听器
function setupEventListeners() {
    // 侧边栏切换
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }

    // 搜索功能
    const searchBtn = document.getElementById('searchToggle');
    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearch);
    }
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarTexts = document.querySelectorAll('.sidebar-text');

    if (sidebar) {
        sidebar.classList.toggle('sidebar-collapsed');

        if (sidebar.classList.contains('sidebar-collapsed')) {
            mainContent?.classList.remove('ml-64');
            mainContent?.classList.add('ml-20');
            sidebarTexts.forEach(text => text.style.display = 'none');
        } else {
            mainContent?.classList.remove('ml-20');
            mainContent?.classList.add('ml-64');
            setTimeout(() => {
                sidebarTexts.forEach(text => text.style.display = 'inline');
            }, 200);
        }
    }
}

// 切换搜索栏
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.classList.toggle('hidden');
    }
}

// 加载用户数据
function loadUserData() {
    // 模拟用户数据
    const userData = {
        name: '张三',
        role: '产品经理',
        avatar: 'JD'
    };

    console.log('用户数据已加载:', userData);
}

// 显示通知
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // 这里可以添加实际的通知UI逻辑
}

// 导出工具函数
window.App = {
    config: AppConfig,
    init: initializeApp,
    showNotification: showNotification
};

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('app.js 已加载');
