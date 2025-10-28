// ProductCoCreate AI - 右侧面板组件

class RightPanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isVisible = false;
        this.currentContent = null;
    }

    render() {
        if (!this.container) {
            console.warn('RightPanel容器未找到');
            return;
        }

        this.container.innerHTML = `
            <div id="rightPanel" class="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg transform translate-x-full transition-transform duration-300 z-20">
                <div class="flex items-center justify-between p-4 border-b">
                    <h2 class="text-lg font-bold text-gray-800">详情</h2>
                    <button id="closeRightPanel" class="text-gray-500 hover:text-primary focus:outline-none">
                        <i class="fa fa-times text-xl"></i>
                    </button>
                </div>
                <div id="rightPanelContent" class="p-4 overflow-y-auto" style="height: calc(100vh - 60px);">
                    ${this.currentContent || '<p class="text-gray-500 text-center mt-8">暂无内容</p>'}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('closeRightPanel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }

    show(content = null) {
        if (content) {
            this.currentContent = content;
            this.render();
        }

        const panel = document.getElementById('rightPanel');
        if (panel) {
            panel.classList.remove('translate-x-full');
            this.isVisible = true;
        }
    }

    hide() {
        const panel = document.getElementById('rightPanel');
        if (panel) {
            panel.classList.add('translate-x-full');
            this.isVisible = false;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    setContent(content) {
        this.currentContent = content;
        const contentContainer = document.getElementById('rightPanelContent');
        if (contentContainer) {
            contentContainer.innerHTML = content;
        }
    }

    showProjectDetails(projectData) {
        const content = `
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-gray-800">${projectData.name}</h3>
                <div class="space-y-2">
                    <p class="text-sm text-gray-600"><strong>状态:</strong> ${projectData.status}</p>
                    <p class="text-sm text-gray-600"><strong>进度:</strong> ${projectData.progress}%</p>
                    <p class="text-sm text-gray-600"><strong>截止日期:</strong> ${projectData.dueDate}</p>
                    <p class="text-sm text-gray-600"><strong>描述:</strong> ${projectData.description}</p>
                </div>
                <div class="mt-6">
                    <h4 class="font-bold text-gray-800 mb-2">团队成员</h4>
                    <div class="space-y-2">
                        ${projectData.team.map(member => `
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                                    ${member.initials}
                                </div>
                                <div class="ml-2">
                                    <p class="text-sm font-medium text-gray-800">${member.name}</p>
                                    <p class="text-xs text-gray-500">${member.role}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        this.show(content);
    }
}

// 导出组件
window.RightPanel = RightPanel;

console.log('RightPanel.js 已加载');
