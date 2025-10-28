// ProductCoCreate AI - AI代理管理视图

class AgentManagementView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.agents = [];
    }

    async init() {
        await this.loadAgents();
        this.render();
        this.attachEventListeners();
    }

    async loadAgents() {
        // 模拟加载AI代理数据
        this.agents = [
            {
                id: 1,
                name: '需求分析代理',
                type: 'requirement',
                status: 'active',
                description: '负责分析和整理产品需求',
                tasksCompleted: 156,
                accuracy: 95
            },
            {
                id: 2,
                name: '设计审核代理',
                type: 'design',
                status: 'active',
                description: '审核设计文档并提供反馈',
                tasksCompleted: 89,
                accuracy: 92
            },
            {
                id: 3,
                name: '代码评审代理',
                type: 'code-review',
                status: 'inactive',
                description: '自动进行代码质量检查',
                tasksCompleted: 234,
                accuracy: 88
            },
            {
                id: 4,
                name: '测试生成代理',
                type: 'testing',
                status: 'active',
                description: '自动生成测试用例',
                tasksCompleted: 178,
                accuracy: 91
            }
        ];
    }

    render() {
        if (!this.container) {
            console.warn('AgentManagementView容器未找到');
            return;
        }

        this.container.innerHTML = `
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-800">AI代理管理</h2>
                <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all-300">
                    <i class="fa fa-plus mr-2"></i> 添加代理
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${this.agents.map(agent => this.renderAgentCard(agent)).join('')}
            </div>
        `;

        this.attachEventListeners();
    }

    renderAgentCard(agent) {
        const statusColor = agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        const statusLabel = agent.status === 'active' ? '运行中' : '已停止';

        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                            <i class="fa fa-robot text-xl"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-lg font-bold text-gray-800">${agent.name}</h3>
                            <span class="text-xs ${statusColor} px-2 py-1 rounded-full">${statusLabel}</span>
                        </div>
                    </div>
                    <button class="text-gray-500 hover:text-primary" data-agent-id="${agent.id}">
                        <i class="fa fa-ellipsis-v"></i>
                    </button>
                </div>

                <p class="text-sm text-gray-600 mb-4">${agent.description}</p>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-xs text-gray-500">已完成任务</p>
                        <p class="text-lg font-bold text-gray-800">${agent.tasksCompleted}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">准确率</p>
                        <p class="text-lg font-bold text-gray-800">${agent.accuracy}%</p>
                    </div>
                </div>

                <div class="flex space-x-2">
                    <button class="flex-1 px-3 py-2 text-sm ${agent.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded-md hover:opacity-80 transition-all-300"
                            data-agent-id="${agent.id}" data-action="toggle">
                        <i class="fa fa-${agent.status === 'active' ? 'pause' : 'play'} mr-1"></i>
                        ${agent.status === 'active' ? '停止' : '启动'}
                    </button>
                    <button class="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:opacity-80 transition-all-300"
                            data-agent-id="${agent.id}" data-action="configure">
                        <i class="fa fa-cog mr-1"></i> 配置
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // 切换代理状态
        const toggleBtns = document.querySelectorAll('[data-action="toggle"]');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const agentId = parseInt(e.currentTarget.dataset.agentId);
                this.toggleAgentStatus(agentId);
            });
        });

        // 配置代理
        const configureBtns = document.querySelectorAll('[data-action="configure"]');
        configureBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const agentId = parseInt(e.currentTarget.dataset.agentId);
                this.configureAgent(agentId);
            });
        });
    }

    toggleAgentStatus(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = agent.status === 'active' ? 'inactive' : 'active';
            this.render();

            if (window.App) {
                window.App.showNotification(
                    `代理"${agent.name}"已${agent.status === 'active' ? '启动' : '停止'}`,
                    'success'
                );
            }
        }
    }

    configureAgent(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (agent) {
            console.log(`配置代理: ${agent.name}`);
            // 这里可以打开配置对话框
        }
    }
}

// 导出视图
window.AgentManagementView = AgentManagementView;

console.log('AgentManagementView.js 已加载');
