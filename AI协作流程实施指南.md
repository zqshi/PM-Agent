# ProductCoCreate AI协作流程实施指南

## 📋 概述

本指南说明如何将基于文档的AI协作流程（需求澄清 → 市场调研 → 需求设计 → 挑战裁决 → 文档精炼）集成到产品协作平台中，使用Mock数据实现完整的13个步骤流程。

---

## ✅ 已完成的工作

### 1. **流程服务层**
- ✅ 已创建 `js/process-flow-service.js`
- ✅ 实现了13个步骤的状态管理
- ✅ 实现了智能澄清问题生成
- ✅ 实现了文档版本管理
- ✅ 使用localStorage存储流程数据

### 2. **版本详情页引入**
- ✅ 在 `version-detail.html` 中引入了流程服务层

---

## 🚀 接下来需要完成的工作

### 步骤1：修改创建流程功能

在 `version-detail.html` 的 `createNewProcess()` 函数中，修改为调用服务层：

```javascript
// 修改 version-detail.html 的 createNewProcess() 函数
function createNewProcess() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    const versionId = urlParams.get('versionId');

    // 显示创建流程对话框
    const processName = prompt('请输入流程名称：', '');
    if (!processName || !processName.trim()) return;

    const productRequirement = prompt('请输入产品需求描述：', '');
    if (!productRequirement || !productRequirement.trim()) {
        alert('产品需求不能为空！');
        return;
    }

    // 调用服务层创建流程
    const processFlow = processFlowService.createProcessFlow({
        processName: processName,
        productRequirement: productRequirement,
        versionId: versionId,
        projectId: projectId
    });

    // 显示成功消息
    const toast = createToast('success', `流程 "${processName}" 创建成功！已自动生成澄清问题。`);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);

    // 跳转到流程详情页
    setTimeout(() => {
        window.location.href = `process-flow-detail.html?processId=${processFlow.id}`;
    }, 1500);
}
```

---

### 步骤2：创建流程详情页面

创建 `process-flow-detail.html`，展示13个步骤的流程状态：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI协作流程详情</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="js/process-flow-service.js"></script>
</head>
<body class="bg-gray-50">
    <!-- 页面内容省略，详见下方完整代码 -->
</body>
</html>
```

**关键功能点**：
- 展示13个步骤的状态（pending/in_progress/completed）
- 点击步骤1.1跳转到需求澄清页面
- 点击步骤1.6跳转到挑战裁决页面
- 实时更新流程进度百分比
- 显示当前步骤和下一步操作

---

### 步骤3：创建需求澄清交互页面

创建 `clarification-interaction.html`，用户填写澄清问题：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>需求澄清</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/process-flow-service.js"></script>
</head>
<body>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">需求澄清问题</h1>

        <div id="questionsContainer"></div>

        <div class="mt-8 flex space-x-4">
            <button onclick="saveDraft()" class="px-6 py-2 border rounded">保存草稿</button>
            <button onclick="submitResponses()" class="px-6 py-2 bg-primary text-white rounded">提交回复</button>
        </div>
    </div>

    <script>
        // 加载澄清问题
        const urlParams = new URLSearchParams(window.location.search);
        const processId = urlParams.get('processId');
        const processFlow = processFlowService.getProcessFlow(processId);

        if (processFlow) {
            const doc = processFlow.steps['1.1'].documents[0];
            renderQuestions(doc.content.questions);
        }

        function renderQuestions(questions) {
            const container = document.getElementById('questionsContainer');
            questions.forEach((q, index) => {
                const questionHTML = `
                    <div class="mb-8 p-6 bg-white rounded-lg shadow">
                        <h3 class="text-lg font-bold mb-4">【澄清问题${index + 1}】${q.category}</h3>

                        <div class="mb-4">
                            <p class="font-medium mb-2">澄清问题：</p>
                            <ul class="list-disc pl-6 space-y-1">
                                ${q.questions.map(text => `<li>${text}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="mb-4">
                            <p class="text-sm text-gray-600"><strong>澄清目的：</strong>${q.purpose}</p>
                        </div>

                        <div>
                            <label class="block font-medium mb-2">💬 用户澄清：</label>
                            <textarea
                                id="response_${q.id}"
                                rows="4"
                                class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary"
                                placeholder="请在此填写您的回复..."
                            >${q.userResponse}</textarea>
                        </div>
                    </div>
                `;
                container.innerHTML += questionHTML;
            });
        }

        function submitResponses() {
            const doc = processFlow.steps['1.1'].documents[0];
            const responses = {};

            doc.content.questions.forEach(q => {
                const textarea = document.getElementById(`response_${q.id}`);
                responses[q.id] = textarea.value.trim();
            });

            // 提交回复
            const updatedFlow = processFlowService.submitClarificationResponses(processId, responses);

            alert('回复已提交！系统正在评估是否需要继续澄清...');

            // 返回流程详情页
            window.location.href = `process-flow-detail.html?processId=${processId}`;
        }

        function saveDraft() {
            alert('草稿已保存！');
        }
    </script>
</body>
</html>
```

---

### 步骤4：创建挑战裁决交互页面

创建 `challenge-decision.html`，用户进行挑战裁决：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>挑战与裁决</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/process-flow-service.js"></script>
</head>
<body>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">挑战与裁决</h1>

        <div id="challengesContainer">
            <!-- Mock数据示例 -->
            <div class="mb-8 p-6 bg-white rounded-lg shadow">
                <h3 class="text-lg font-bold mb-4">【原则性问题1】功能描述缺乏结构化</h3>

                <div class="mb-4 p-4 bg-red-50 rounded">
                    <p class="font-medium text-red-700 mb-2">🔴 挑战Agent观点</p>
                    <p class="text-sm">问题描述：功能模块A的描述过于宽泛，缺乏明确的输入输出定义和业务规则...</p>
                    <p class="text-sm mt-2">挑战理由：违反了"结构化与可解析"原则...</p>
                </div>

                <div class="mb-4 p-4 bg-green-50 rounded">
                    <p class="font-medium text-green-700 mb-2">✅ 设计Agent回应</p>
                    <p class="text-sm">回应方案：同意增加结构化描述，将补充以下内容：</p>
                    <ul class="text-sm list-disc pl-6 mt-2">
                        <li>输入：用户查询文本（字符串，1-500字）</li>
                        <li>输出：结构化答案对象...</li>
                    </ul>
                </div>

                <div class="p-4 bg-blue-50 rounded">
                    <p class="font-medium mb-3">👤 人类裁决（请选择一项）</p>
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="radio" name="decision_1" value="adopt_challenge" class="mr-2">
                            <span>采纳挑战：同意挑战Agent观点，按挑战要求修改</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="decision_1" value="adopt_response" class="mr-2" checked>
                            <span>采纳回应：同意设计Agent回应方案，按回应修改</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="decision_1" value="custom" class="mr-2">
                            <span>自定义修改：</span>
                        </label>
                        <textarea
                            id="custom_1"
                            rows="2"
                            class="w-full px-3 py-2 border rounded ml-6"
                            placeholder="请输入您的自定义修改方案..."
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 flex space-x-4">
            <button onclick="saveDecisions()" class="px-6 py-2 border rounded">保存裁决</button>
            <button onclick="submitDecisions()" class="px-6 py-2 bg-primary text-white rounded">提交全部裁决</button>
        </div>
    </div>

    <script>
        function submitDecisions() {
            alert('裁决已提交！系统将根据您的决策更新需求设计文档。');
            const urlParams = new URLSearchParams(window.location.search);
            const processId = urlParams.get('processId');
            window.location.href = `process-flow-detail.html?processId=${processId}`;
        }

        function saveDecisions() {
            alert('裁决已保存！');
        }
    </script>
</body>
</html>
```

---

### 步骤5：扩展服务层功能

在 `process-flow-service.js` 中添加更多方法：

```javascript
/**
 * 生成需求设计文档（Mock）
 */
generateDesignDocument(processId) {
    const flow = this.getProcessFlow(processId);
    const version = Date.now();

    const document = {
        id: `doc_design_${version}`,
        type: '需求设计文档-传统版',
        version: `v${version}`,
        createdAt: new Date().toISOString(),
        content: {
            background: '需求背景...',
            userStories: [
                {
                    as: '产品经理',
                    want: '查看流程状态',
                    so: '了解项目进展'
                }
            ],
            acceptanceCriteria: '验收标准...',
            businessRules: '业务规则...'
        },
        status: 'completed'
    };

    flow.steps['1.3'].documents.push(document);
    flow.documents.push(document);
    this.updateStepStatus(processId, '1.3', 'completed');

    return document;
}

/**
 * 生成挑战文档（Mock）
 */
generateChallengeDocument(processId) {
    const flow = this.getProcessFlow(processId);
    const version = Date.now();

    const document = {
        id: `doc_challenge_${version}`,
        type: '需求设计挑战文档',
        version: `v${version}`,
        createdAt: new Date().toISOString(),
        content: {
            challenges: [
                {
                    id: 'c1',
                    category: '原则性问题',
                    title: '功能描述缺乏结构化',
                    description: '功能模块A的描述过于宽泛...',
                    reason: '违反了"结构化与可解析"原则',
                    severity: 'high'
                }
            ]
        },
        status: 'completed'
    };

    flow.steps['1.4'].documents.push(document);
    flow.documents.push(document);
    this.updateStepStatus(processId, '1.4', 'completed');

    return document;
}
```

---

## 🎯 完整流程演示

### 用户操作流程：

1. **创建版本** → 输入产品需求 → 自动创建流程
2. **进入流程详情页** → 查看13个步骤状态
3. **点击"1.1 需求澄清"** → 填写澄清问题 → 提交回复
4. **系统自动评估** → 生成澄清分析文档 → 判断是否需要市场调研
5. **执行/跳过市场调研** → 进入需求设计步骤
6. **系统生成需求设计文档** → 自动触发质量挑战
7. **点击"1.6 人类裁决"** → 查看挑战和回应 → 进行裁决决策
8. **系统根据裁决更新文档** → 进入人类评估步骤
9. **用户确认通过** → 进入文档精炼步骤
10. **生成LLM版需求文档** → 流程完成

---

## 📊 数据流转示意图

```
用户输入产品需求
    ↓
createProcessFlow()
    ↓
生成流程对象（13个步骤）
    ↓
generateClarificationQuestions()
    ↓
用户填写澄清回复
    ↓
submitClarificationResponses()
    ↓
generateClarificationAnalysisDocument()
    ↓
determineMarketResearchNeed()
    ↓ (如需要)
executeMarketResearch()
    ↓
generateDesignDocument()
    ↓
generateChallengeDocument()
    ↓
用户进行裁决决策
    ↓
updateDesignBasedOnDecisions()
    ↓
generateRefinedDocument()
    ↓
流程完成
```

---

## 🔧 技术实现要点

### 1. **状态管理**
- 使用localStorage存储流程状态
- 每个步骤有独立的状态（pending/in_progress/completed/skipped）
- 支持流程暂停和恢复

### 2. **Mock数据智能生成**
- 根据需求关键词智能生成澄清问题
- 根据用户回复判断是否需要市场调研
- 模拟AI Agent的专业输出

### 3. **页面跳转逻辑**
```javascript
// 流程详情页 → 需求澄清页
window.location.href = `clarification-interaction.html?processId=${processId}`;

// 需求澄清页 → 流程详情页
window.location.href = `process-flow-detail.html?processId=${processId}`;

// 流程详情页 → 挑战裁决页
window.location.href = `challenge-decision.html?processId=${processId}`;
```

### 4. **文档版本管理**
- 每个文档使用时间戳版本号
- 记录文档依赖关系
- 支持版本对比和回溯

---

## ⚠️ 注意事项

1. **Mock数据的真实性**：当前是简化的mock数据，实际应用中需要调用真实的AI Agent
2. **错误处理**：需要添加完善的错误处理和边界条件检查
3. **性能优化**：大量文档时需要考虑分页和虚拟滚动
4. **权限控制**：需要添加用户权限验证
5. **数据持久化**：生产环境应使用数据库而不是localStorage

---

## 📚 参考文档

- 流程说明：`/Users/zqs/Downloads/project/test/流程说明.md`
- 项目分析：`/Users/zqs/Downloads/project/test/项目分析与平台化方案.md`
- 需求文档：`/Users/zqs/Downloads/project/test/需求.md`

---

## 🎉 总结

通过以上步骤，您将实现一个完整的AI协作流程平台，支持：
- ✅ 智能需求澄清
- ✅ 自动市场调研判断
- ✅ AI驱动的需求设计
- ✅ 质量挑战机制
- ✅ 人机协同裁决
- ✅ 文档版本管理

所有功能都使用mock数据实现，无需后端支持即可演示完整流程！
