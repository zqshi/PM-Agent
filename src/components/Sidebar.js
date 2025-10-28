// ProductCoCreate AI - 侧边栏组件

class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isCollapsed = false;
        this.menuItems = [
            { icon: 'fa-dashboard', label: '仪表盘', href: 'dashboard.html', active: true },
            { icon: 'fa-folder-open', label: '项目管理', href: 'project-management.html', active: false },
            { icon: 'fa-file-text', label: '需求澄清', href: 'requirement-clarification.html', active: false },
            { icon: 'fa-paint-brush', label: '设计文档', href: 'document-management.html', active: false },
            { icon: 'fa-cogs', label: '流程管理', href: 'process-management.html', active: false },
            { icon: 'fa-gavel', label: '挑战与裁决', href: 'challenge-arbitration.html', active: false },
            { icon: 'fa-cog', label: '系统设置', href: '#', active: false }
        ];
    }

    render() {
        if (!this.container) {
            console.warn('Sidebar容器未找到');
            return;
        }

        this.container.innerHTML = `
            <aside id="sidebar" class="sidebar bg-white shadow-md h-screen fixed left-0 top-0 z-10">
                <div class="p-4 flex items-center justify-between border-b">
                    <div class="flex items-center">
                        <img src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/e10cd3e372b34c81bd38e133e4bd5b6f~tplv-a9rns2rl98-image.image"
                             alt="ProductCoCreate AI" class="h-8">
                        <h1 class="ml-2 text-lg font-bold text-gray-800 sidebar-text">ProductCoCreate AI</h1>
                    </div>
                    <button id="toggleSidebar" class="text-gray-500 hover:text-primary focus:outline-none">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>
                <nav class="mt-4">
                    <ul>
                        ${this.menuItems.map(item => this.renderMenuItem(item)).join('')}
                    </ul>
                </nav>
                <div class="absolute bottom-0 w-full p-4 border-t">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                            <span class="font-medium">JD</span>
                        </div>
                        <div class="ml-3 sidebar-text">
                            <p class="text-sm font-medium text-gray-800">张三</p>
                            <p class="text-xs text-gray-500">产品经理</p>
                        </div>
                        <button class="ml-auto text-gray-500 hover:text-primary focus:outline-none" id="logoutBtn">
                            <i class="fa fa-sign-out"></i>
                        </button>
                    </div>
                </div>
            </aside>
        `;

        this.attachEventListeners();
    }

    renderMenuItem(item) {
        const activeClass = item.active ? 'sidebar-active' : '';
        return `
            <li>
                <a href="${item.href}" class="${activeClass} flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-all-300">
                    <i class="fa ${item.icon} w-6 text-center"></i>
                    <span class="ml-3 sidebar-text">${item.label}</span>
                </a>
            </li>
        `;
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('toggleSidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    toggle() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const sidebarTexts = document.querySelectorAll('.sidebar-text');

        this.isCollapsed = !this.isCollapsed;

        if (sidebar) {
            sidebar.classList.toggle('sidebar-collapsed');

            if (this.isCollapsed) {
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

    logout() {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'index.html';
        }
    }

    setActiveItem(href) {
        this.menuItems = this.menuItems.map(item => ({
            ...item,
            active: item.href === href
        }));
        this.render();
    }
}

// 导出组件
window.Sidebar = Sidebar;

console.log('Sidebar.js 已加载');
