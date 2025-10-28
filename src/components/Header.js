// ProductCoCreate AI - 头部组件

class Header {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.notificationCount = 3;
        this.messageCount = 5;
    }

    render() {
        if (!this.container) {
            console.warn('Header容器未找到');
            return;
        }

        this.container.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">仪表盘</h1>
                    <p class="text-sm text-gray-600">欢迎回来！以下是您的项目今日动态。</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <button id="notificationBtn" class="text-gray-500 hover:text-primary focus:outline-none">
                            <i class="fa fa-bell text-xl"></i>
                            <span class="notification-badge">${this.notificationCount}</span>
                        </button>
                    </div>
                    <div class="relative">
                        <button id="messageBtn" class="text-gray-500 hover:text-primary focus:outline-none">
                            <i class="fa fa-envelope text-xl"></i>
                            <span class="notification-badge">${this.messageCount}</span>
                        </button>
                    </div>
                    <div class="relative">
                        <button id="searchToggle" class="text-gray-500 hover:text-primary focus:outline-none">
                            <i class="fa fa-search text-xl"></i>
                        </button>
                        <div id="searchBar" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg">
                            <div class="flex items-center px-3 py-2 border-b">
                                <input type="text" placeholder="搜索..." class="w-full focus:outline-none text-sm">
                                <button class="text-gray-500 hover:text-primary focus:outline-none">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const searchToggle = document.getElementById('searchToggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                const searchBar = document.getElementById('searchBar');
                searchBar?.classList.toggle('hidden');
            });
        }

        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                console.log('显示通知');
            });
        }

        const messageBtn = document.getElementById('messageBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                console.log('显示消息');
            });
        }
    }

    updateNotificationCount(count) {
        this.notificationCount = count;
        const badge = document.querySelector('#notificationBtn .notification-badge');
        if (badge) {
            badge.textContent = count;
        }
    }

    updateMessageCount(count) {
        this.messageCount = count;
        const badge = document.querySelector('#messageBtn .notification-badge');
        if (badge) {
            badge.textContent = count;
        }
    }
}

// 导出组件
window.Header = Header;

console.log('Header.js 已加载');
