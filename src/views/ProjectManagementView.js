// ProductCoCreate AI - 项目管理视图

class ProjectManagementView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
    }

    async init() {
        await this.loadProjects();
        this.render();
        this.attachEventListeners();
    }

    async loadProjects() {
        // 模拟加载项目数据
        this.projects = [
            {
                id: 1,
                name: '移动应用重新设计',
                status: 'in-progress',
                progress: 75,
                dueDate: '2025-10-31',
                description: '重新设计移动应用的用户界面和用户体验',
                team: [
                    { name: '张三', role: '产品经理', initials: 'ZS' },
                    { name: '李四', role: '设计师', initials: 'LS' }
                ]
            },
            {
                id: 2,
                name: '仪表盘UI/UX设计',
                status: 'in-progress',
                progress: 45,
                dueDate: '2025-11-05',
                description: '创建现代化的仪表盘界面设计',
                team: [
                    { name: '王五', role: 'UI设计师', initials: 'WW' }
                ]
            },
            {
                id: 3,
                name: '电商平台升级',
                status: 'pending',
                progress: 20,
                dueDate: '2025-11-15',
                description: '升级电商平台的核心功能',
                team: [
                    { name: '赵六', role: '开发工程师', initials: 'ZL' }
                ]
            },
            {
                id: 4,
                name: '遗留系统迁移',
                status: 'review',
                progress: 85,
                dueDate: '2025-10-29',
                description: '将遗留系统迁移到新架构',
                team: [
                    { name: '孙七', role: '架构师', initials: 'SQ' }
                ]
            }
        ];

        this.filteredProjects = this.projects;
    }

    render() {
        if (!this.container) {
            console.warn('ProjectManagementView容器未找到');
            return;
        }

        this.container.innerHTML = `
            <div class="mb-6 flex items-center justify-between">
                <div class="flex space-x-2">
                    <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                        全部 (${this.projects.length})
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'in-progress' ? 'active' : ''}" data-filter="in-progress">
                        进行中 (${this.projects.filter(p => p.status === 'in-progress').length})
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'pending' ? 'active' : ''}" data-filter="pending">
                        待处理 (${this.projects.filter(p => p.status === 'pending').length})
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'review' ? 'active' : ''}" data-filter="review">
                        审核中 (${this.projects.filter(p => p.status === 'review').length})
                    </button>
                </div>
                <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all-300">
                    <i class="fa fa-plus mr-2"></i> 新建项目
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${this.filteredProjects.map(project => this.renderProjectCard(project)).join('')}
            </div>
        `;

        this.attachEventListeners();
    }

    renderProjectCard(project) {
        const statusClass = {
            'pending': 'status-pending',
            'in-progress': 'status-in-progress',
            'review': 'status-review',
            'completed': 'status-completed'
        }[project.status] || 'status-pending';

        const statusLabel = {
            'pending': '待处理',
            'in-progress': '进行中',
            'review': '审核中',
            'completed': '已完成'
        }[project.status] || '未知';

        return `
            <div class="bg-white rounded-lg shadow-md p-6 task-card" data-project-id="${project.id}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800">${project.name}</h3>
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </div>
                <p class="text-sm text-gray-600 mb-4">${project.description}</p>
                <div class="mb-4">
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>进度</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill bg-blue-500" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                        ${project.team.map(member => `
                            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs border-2 border-white">
                                ${member.initials}
                            </div>
                        `).join('')}
                    </div>
                    <span class="text-xs text-gray-500">${project.dueDate}</span>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // 过滤按钮
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterProjects(filter);
            });
        });

        // 项目卡片点击
        const projectCards = document.querySelectorAll('[data-project-id]');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = parseInt(e.currentTarget.dataset.projectId);
                this.showProjectDetails(projectId);
            });
        });
    }

    filterProjects(filter) {
        this.currentFilter = filter;

        if (filter === 'all') {
            this.filteredProjects = this.projects;
        } else {
            this.filteredProjects = this.projects.filter(p => p.status === filter);
        }

        this.render();
    }

    showProjectDetails(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project && window.RightPanel) {
            const rightPanel = new window.RightPanel('rightPanelContainer');
            rightPanel.render();
            rightPanel.showProjectDetails(project);
        }
    }
}

// 导出视图
window.ProjectManagementView = ProjectManagementView;

console.log('ProjectManagementView.js 已加载');
