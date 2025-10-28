/**
 * AI协作流程服务层 - Mock数据实现
 * 模拟ProductCoCreate的13个步骤流程
 */

class ProcessFlowService {
    constructor() {
        this.storageKey = 'process_flows';
        this.initializeStorage();
    }

    /**
     * 初始化存储
     */
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    /**
     * 根据产品需求创建AI协作流程
     * @param {Object} params - 参数对象
     * @param {string} params.processName - 流程名称
     * @param {string} params.productRequirement - 产品需求描述
     * @param {string} params.versionId - 版本ID
     * @param {string} params.projectId - 项目ID
     * @returns {Object} 创建的流程对象
     */
    createProcessFlow(params) {
        const { processName, productRequirement, versionId, projectId } = params;

        const processId = `process_${Date.now()}`;
        const timestamp = new Date().toISOString();

        // 创建13个步骤的流程
        const processFlow = {
            id: processId,
            name: processName,
            requirement: productRequirement,
            versionId: versionId,
            projectId: projectId,
            status: 'in_progress', // pending, in_progress, completed
            currentStep: '1.1',
            createdAt: timestamp,
            updatedAt: timestamp,

            // 13个步骤的状态
            steps: {
                '1.1': this.createStep('1.1', '需求澄清', 'in_progress', productRequirement),
                '1.2': this.createStep('1.2', '市场调研', 'pending'),
                '1.3': this.createStep('1.3', '需求设计', 'pending'),
                '1.4': this.createStep('1.4', '设计挑战', 'pending'),
                '1.5': this.createStep('1.5', '挑战回应', 'pending'),
                '1.6': this.createStep('1.6', '人类裁决', 'pending'),
                '1.7': this.createStep('1.7', '设计更新', 'pending'),
                '1.8': this.createStep('1.8', '人类评估', 'pending'),
                '1.9': this.createStep('1.9', '文档修改', 'pending'),
                '1.11': this.createStep('1.11', '差异检查', 'pending'),
                '1.12': this.createStep('1.12', '文档精炼', 'pending'),
                '1.13': this.createStep('1.13', '强制检查点', 'pending')
            },

            // 文档版本记录
            documents: []
        };

        // 自动生成第一个澄清问题文档
        this.generateClarificationDocument(processFlow);

        // 保存到存储
        this.saveProcessFlow(processFlow);

        return processFlow;
    }

    /**
     * 创建步骤对象
     */
    createStep(stepId, stepName, status, input = null) {
        return {
            id: stepId,
            name: stepName,
            status: status, // pending, in_progress, completed, skipped
            startedAt: status === 'in_progress' ? new Date().toISOString() : null,
            completedAt: null,
            input: input,
            output: null,
            agentName: this.getAgentForStep(stepId),
            documents: []
        };
    }

    /**
     * 获取步骤对应的Agent
     */
    getAgentForStep(stepId) {
        const agentMap = {
            '1.1': 'product-demand-manager-agent',
            '1.2': 'product-research-analyst-agent',
            '1.3': 'product-demand-manager-agent',
            '1.4': 'product-demand-challenge-agent',
            '1.5': 'product-demand-manager-agent',
            '1.7': 'product-demand-manager-agent',
            '1.9': 'product-demand-manager-agent',
            '1.12': 'product-demand-refine-agent'
        };
        return agentMap[stepId] || null;
    }

    /**
     * 生成澄清问题文档（Mock数据）
     */
    generateClarificationDocument(processFlow) {
        const requirement = processFlow.requirement;
        const version = Date.now();

        // 根据需求智能生成澄清问题
        const questions = this.generateClarificationQuestions(requirement);

        const document = {
            id: `doc_clarification_${version}`,
            type: '需求澄清问题',
            version: `v${version}`,
            createdAt: new Date().toISOString(),
            content: {
                requirement: requirement,
                questions: questions
            },
            status: 'waiting_user_response' // waiting_user_response, completed
        };

        processFlow.steps['1.1'].documents.push(document);
        processFlow.documents.push(document);

        return document;
    }

    /**
     * 根据需求生成澄清问题（Mock智能生成）
     */
    generateClarificationQuestions(requirement) {
        // 简化的智能问题生成逻辑
        const questions = [];

        // 问题1: 目标用户与使用场景
        questions.push({
            id: 'q1',
            category: '目标用户与使用场景',
            questions: [
                '1. 主要使用者是哪些部门的员工或用户角色？',
                '2. 典型的使用场景有哪些？请描述2-3个核心场景。',
                '3. 预计的并发用户数量级和使用频率？'
            ],
            purpose: '明确目标用户群体和使用场景，帮助确定系统的功能优先级和交互设计方向。',
            userResponse: ''
        });

        // 问题2: 核心功能边界
        questions.push({
            id: 'q2',
            category: '核心功能边界',
            questions: [
                '1. 产品需要解决的核心问题是什么？',
                '2. 哪些功能是MVP必需的？哪些可以在后续版本实现？',
                '3. 是否有不希望包含的功能或场景？'
            ],
            purpose: '确定产品功能边界，避免功能蔓延，确保MVP可以快速上线。',
            userResponse: ''
        });

        // 问题3: 数据与集成
        questions.push({
            id: 'q3',
            category: '数据与集成',
            questions: [
                '1. 需要处理哪些类型的数据？数据规模如何？',
                '2. 是否需要与现有系统集成？如果是，请说明集成方式。',
                '3. 数据安全和隐私有什么特殊要求？'
            ],
            purpose: '了解数据处理需求和系统集成要求，为技术架构设计提供依据。',
            userResponse: ''
        });

        // 根据需求关键词添加特定问题
        if (requirement.includes('AI') || requirement.includes('智能') || requirement.includes('自动')) {
            questions.push({
                id: 'q4',
                category: 'AI能力需求',
                questions: [
                    '1. 期望AI提供什么样的能力？（如：内容生成、分析、推荐等）',
                    '2. 对AI准确率和响应速度有什么要求？',
                    '3. 用户是否需要对AI输出进行干预和调整？'
                ],
                purpose: '明确AI能力的具体需求和质量标准，确保技术方案可行性。',
                userResponse: ''
            });
        }

        if (requirement.includes('协作') || requirement.includes('团队') || requirement.includes('多人')) {
            questions.push({
                id: 'q5',
                category: '协作模式',
                questions: [
                    '1. 团队协作的典型场景是什么？',
                    '2. 需要什么样的权限控制和角色划分？',
                    '3. 如何处理协作冲突和版本管理？'
                ],
                purpose: '设计合理的协作机制和权限体系，确保团队协作顺畅。',
                userResponse: ''
            });
        }

        return questions;
    }

    /**
     * 保存流程
     */
    saveProcessFlow(processFlow) {
        const flows = this.getAllProcessFlows();
        flows[processFlow.id] = processFlow;
        localStorage.setItem(this.storageKey, JSON.stringify(flows));
    }

    /**
     * 获取所有流程
     */
    getAllProcessFlows() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    /**
     * 获取单个流程
     */
    getProcessFlow(processId) {
        const flows = this.getAllProcessFlows();
        return flows[processId] || null;
    }

    /**
     * 更新流程步骤状态
     */
    updateStepStatus(processId, stepId, status, output = null) {
        const flow = this.getProcessFlow(processId);
        if (!flow) return null;

        flow.steps[stepId].status = status;
        if (status === 'completed') {
            flow.steps[stepId].completedAt = new Date().toISOString();
            flow.steps[stepId].output = output;
        }
        if (status === 'in_progress' && !flow.steps[stepId].startedAt) {
            flow.steps[stepId].startedAt = new Date().toISOString();
        }

        flow.updatedAt = new Date().toISOString();
        this.saveProcessFlow(flow);

        return flow;
    }

    /**
     * 提交澄清回复
     */
    submitClarificationResponses(processId, responses) {
        const flow = this.getProcessFlow(processId);
        if (!flow) return null;

        // 更新文档中的用户回复
        const doc = flow.steps['1.1'].documents[0];
        doc.content.questions.forEach((q, index) => {
            if (responses[q.id]) {
                q.userResponse = responses[q.id];
            }
        });
        doc.status = 'completed';

        // 评估是否需要继续澄清
        const allAnswered = doc.content.questions.every(q => q.userResponse.trim() !== '');

        if (allAnswered) {
            // 生成需求收集澄清分析文档
            this.generateClarificationAnalysisDocument(flow);

            // 完成步骤1.1
            this.updateStepStatus(processId, '1.1', 'completed');

            // 进入步骤1.2判断阶段
            flow.currentStep = '1.2_judgment';
        } else {
            // 生成新的澄清问题
            this.generateClarificationDocument(flow);
        }

        this.saveProcessFlow(flow);
        return flow;
    }

    /**
     * 生成需求收集澄清分析文档
     */
    generateClarificationAnalysisDocument(flow) {
        const version = Date.now();
        const clarificationDoc = flow.steps['1.1'].documents[0];

        const document = {
            id: `doc_analysis_${version}`,
            type: '需求收集澄清分析',
            version: `v${version}`,
            createdAt: new Date().toISOString(),
            content: {
                originalRequirement: flow.requirement,
                clarifications: clarificationDoc.content.questions,
                analysis: this.analyzeClarifications(clarificationDoc.content.questions),
                needsMarketResearch: this.determineMarketResearchNeed(flow.requirement, clarificationDoc.content.questions)
            },
            status: 'completed'
        };

        flow.documents.push(document);
        return document;
    }

    /**
     * 分析澄清结果
     */
    analyzeClarifications(questions) {
        return {
            targetUsers: this.extractInfo(questions, 'q1'),
            coreFeatures: this.extractInfo(questions, 'q2'),
            dataRequirements: this.extractInfo(questions, 'q3'),
            aiCapabilities: this.extractInfo(questions, 'q4'),
            collaborationNeeds: this.extractInfo(questions, 'q5')
        };
    }

    /**
     * 提取信息
     */
    extractInfo(questions, questionId) {
        const question = questions.find(q => q.id === questionId);
        return question ? question.userResponse : null;
    }

    /**
     * 判断是否需要市场调研
     */
    determineMarketResearchNeed(requirement, questions) {
        // 简化逻辑：包含"竞品"、"市场"等关键词则需要调研
        const keywords = ['竞品', '市场', '对比', '分析'];
        const needsResearch = keywords.some(keyword =>
            requirement.includes(keyword) ||
            questions.some(q => q.userResponse.includes(keyword))
        );
        return needsResearch;
    }

    /**
     * 执行市场调研
     */
    executeMarketResearch(processId) {
        const flow = this.getProcessFlow(processId);
        if (!flow) return null;

        // 更新步骤状态
        this.updateStepStatus(processId, '1.2', 'in_progress');

        // 生成市场调研文档（Mock）
        const version = Date.now();
        const document = {
            id: `doc_research_${version}`,
            type: '需求调研分析',
            version: `v${version}`,
            createdAt: new Date().toISOString(),
            content: {
                marketOverview: '市场概况分析...',
                competitors: this.generateCompetitorAnalysis(flow.requirement),
                opportunities: '市场机会识别...',
                recommendations: '建议和洞察...'
            },
            status: 'completed'
        };

        flow.steps['1.2'].documents.push(document);
        flow.documents.push(document);

        // 完成市场调研步骤
        this.updateStepStatus(processId, '1.2', 'completed');
        flow.currentStep = '1.3';

        this.saveProcessFlow(flow);
        return flow;
    }

    /**
     * 生成竞品分析（Mock）
     */
    generateCompetitorAnalysis(requirement) {
        return [
            {
                name: '竞品A',
                strengths: ['功能完善', '用户体验好'],
                weaknesses: ['价格较高', '学习成本大'],
                marketShare: '30%'
            },
            {
                name: '竞品B',
                strengths: ['价格优势', '易于上手'],
                weaknesses: ['功能相对简单', '缺乏高级特性'],
                marketShare: '25%'
            }
        ];
    }

    /**
     * 跳过市场调研
     */
    skipMarketResearch(processId) {
        const flow = this.getProcessFlow(processId);
        if (!flow) return null;

        this.updateStepStatus(processId, '1.2', 'skipped');
        flow.currentStep = '1.3';

        this.saveProcessFlow(flow);
        return flow;
    }

    /**
     * 获取流程进度百分比
     */
    getProgressPercentage(processFlow) {
        const totalSteps = Object.keys(processFlow.steps).length;
        const completedSteps = Object.values(processFlow.steps).filter(s => s.status === 'completed').length;
        return Math.round((completedSteps / totalSteps) * 100);
    }

    /**
     * 创建Mock流程1 - 用户登录功能优化（需求澄清阶段）
     */
    createMockProcess1() {
        return {
            "id": "mock_process_1",
            "name": "用户登录功能优化",
            "requirement": "优化用户登录流程，支持多种登录方式（用户名/邮箱/手机号登录）",
            "versionId": "version_001",
            "projectId": "project_001",
            "status": "in_progress",
            "currentStep": "1.1",
            "createdAt": "2025-10-29T06:00:00.000Z",
            "updatedAt": "2025-10-29T08:00:00.000Z",
            "steps": {
                "1.1": {
                    "id": "1.1",
                    "name": "需求澄清",
                    "status": "in_progress",
                    "startedAt": "2025-10-29T06:00:00.000Z",
                    "completedAt": null,
                    "input": "优化用户登录流程，支持多种登录方式（用户名/邮箱/手机号登录）",
                    "output": null,
                    "agentName": "product-demand-manager-agent",
                    "clarificationRounds": [
                        {
                            "roundNumber": 1,
                            "status": "completed",
                            "agentMessage": "我已经分析了您的需求，有几个关键问题需要澄清，以便我能更好地理解登录功能的具体要求。",
                            "questions": [
                                {
                                    "id": "r1_q1",
                                    "question": "目标用户群体是哪些？是面向C端个人用户、B端企业用户，还是两者都有？",
                                    "status": "answered",
                                    "answer": "主要面向C端个人用户，未来可能扩展到B端。",
                                    "answeredBy": "张三（产品经理）",
                                    "answeredAt": "2025-10-29T06:30:00.000Z"
                                },
                                {
                                    "id": "r1_q2",
                                    "question": "用户主要在什么设备和场景下使用登录功能？（PC端、移动端、平板等）",
                                    "status": "answered",
                                    "answer": "主要是移动端（iOS和Android），PC端为辅。用户通常在首次安装APP或更换设备时需要登录。",
                                    "answeredBy": "张三（产品经理）",
                                    "answeredAt": "2025-10-29T06:32:00.000Z"
                                },
                                {
                                    "id": "r1_q3",
                                    "question": "是否需要支持第三方登录（如微信、QQ、Apple ID等）？",
                                    "status": "answered",
                                    "answer": "是的，需要支持微信和Apple ID登录，优先级最高。",
                                    "answeredBy": "张三（产品经理）",
                                    "answeredAt": "2025-10-29T06:35:00.000Z"
                                }
                            ],
                            "userSummary": "用户确认了产品主要面向C端移动端用户，需要支持微信和Apple ID第三方登录。",
                            "completedAt": "2025-10-29T06:40:00.000Z"
                        },
                        {
                            "roundNumber": 2,
                            "status": "completed",
                            "agentMessage": "根据您第一轮的回答，我需要进一步确认关于第三方登录和安全性的具体要求。",
                            "questions": [
                                {
                                    "id": "r2_q1",
                                    "question": "第三方登录后，是否需要用户补充手机号或邮箱进行账号绑定？",
                                    "status": "answered",
                                    "answer": "是的，首次第三方登录后需要引导用户绑定手机号，用于后续找回密码和安全验证。",
                                    "answeredBy": "张三（产品经理）",
                                    "answeredAt": "2025-10-29T07:00:00.000Z"
                                },
                                {
                                    "id": "r2_q2",
                                    "question": "手机号登录是通过验证码还是密码？是否支持免密登录？",
                                    "status": "answered",
                                    "answer": "支持验证码和密码两种方式。老用户优先使用密码，新用户可以通过验证码快速注册登录。",
                                    "answeredBy": "张三（产品经理）",
                                    "answeredAt": "2025-10-29T07:05:00.000Z"
                                },
                                {
                                    "id": "r2_q3",
                                    "question": "是否需要支持生物识别（指纹、Face ID）进行快速登录？",
                                    "status": "answered",
                                    "answer": "需要支持，这是移动端用户的强需求，可以大幅提升登录体验。",
                                    "answeredBy": "张三（产品经理）",
                                    "answeredAt": "2025-10-29T07:10:00.000Z"
                                }
                            ],
                            "userSummary": "明确了账号绑定策略、登录方式选择和生物识别支持需求。",
                            "completedAt": "2025-10-29T07:15:00.000Z"
                        },
                        {
                            "roundNumber": 3,
                            "status": "in_progress",
                            "agentMessage": "最后，我需要了解一些技术实现和数据相关的细节。",
                            "questions": [
                                {
                                    "id": "r3_q1",
                                    "question": "现有系统是否已经支持邮箱和手机号作为账号标识？数据库需要做哪些调整？",
                                    "status": "pending",
                                    "answer": null,
                                    "answeredBy": null,
                                    "answeredAt": null
                                },
                                {
                                    "id": "r3_q2",
                                    "question": "登录失败次数是否有限制？超过限制后如何处理（锁定账号、图形验证码等）？",
                                    "status": "pending",
                                    "answer": null,
                                    "answeredBy": null,
                                    "answeredAt": null
                                },
                                {
                                    "id": "r3_q3",
                                    "question": "是否需要记录用户的登录日志（设备、IP、时间等）供用户查看？",
                                    "status": "pending",
                                    "answer": null,
                                    "answeredBy": null,
                                    "answeredAt": null
                                }
                            ],
                            "userSummary": null,
                            "completedAt": null
                        }
                    ],
                    "clarificationQuestions": [
                        {
                            "id": "q1",
                            "category": "目标用户与使用场景",
                            "question": "目标用户群体是哪些？是面向C端个人用户、B端企业用户，还是两者都有？",
                            "status": "answered",
                            "answer": "主要面向C端个人用户，未来可能扩展到B端。",
                            "answeredBy": "张三（产品经理）",
                            "answeredAt": "2025-10-29T06:30:00.000Z"
                        },
                        {
                            "id": "q2",
                            "category": "目标用户与使用场景",
                            "question": "用户主要在什么设备和场景下使用登录功能？（PC端、移动端、平板等）",
                            "status": "answered",
                            "answer": "主要是移动端（iOS和Android），PC端为辅。",
                            "answeredBy": "张三（产品经理）",
                            "answeredAt": "2025-10-29T06:32:00.000Z"
                        },
                        {
                            "id": "q3",
                            "category": "核心功能边界",
                            "question": "是否需要支持第三方登录（如微信、QQ、Apple ID等）？",
                            "status": "pending",
                            "answer": null,
                            "answeredBy": null,
                            "answeredAt": null
                        },
                        {
                            "id": "q4",
                            "category": "核心功能边界",
                            "question": "手机号登录是通过验证码还是密码？是否支持免密登录？",
                            "status": "pending",
                            "answer": null,
                            "answeredBy": null,
                            "answeredAt": null
                        },
                        {
                            "id": "q5",
                            "category": "安全与合规",
                            "question": "是否需要支持双因素认证（2FA）或生物识别（指纹、Face ID）？",
                            "status": "pending",
                            "answer": null,
                            "answeredBy": null,
                            "answeredAt": null
                        },
                        {
                            "id": "q6",
                            "category": "数据与集成",
                            "question": "现有系统是否已经支持邮箱和手机号作为账号标识？数据库需要做哪些调整？",
                            "status": "pending",
                            "answer": null,
                            "answeredBy": null,
                            "answeredAt": null
                        }
                    ],
                    "documents": []
                },
                "1.2": { "id": "1.2", "name": "市场调研", "status": "pending", "agentName": "product-research-analyst-agent" },
                "1.3": { "id": "1.3", "name": "需求设计", "status": "pending", "agentName": "product-demand-manager-agent" },
                "1.4": { "id": "1.4", "name": "设计挑战", "status": "pending", "agentName": "product-demand-challenge-agent" },
                "1.5": { "id": "1.5", "name": "挑战回应", "status": "pending", "agentName": "product-demand-manager-agent" },
                "1.6": { "id": "1.6", "name": "人类裁决", "status": "pending", "agentName": null },
                "1.7": { "id": "1.7", "name": "设计更新", "status": "pending", "agentName": "product-demand-manager-agent" },
                "1.8": { "id": "1.8", "name": "人类评估", "status": "pending", "agentName": null },
                "1.9": { "id": "1.9", "name": "文档修改", "status": "pending", "agentName": "product-demand-manager-agent" },
                "1.11": { "id": "1.11", "name": "差异检查", "status": "pending", "agentName": "product-demand-manager-agent" },
                "1.12": { "id": "1.12", "name": "文档精炼", "status": "pending", "agentName": "product-demand-manager-agent" },
                "1.13": { "id": "1.13", "name": "强制检查点", "status": "pending", "agentName": null }
            },
            "documents": [
                {
                    "id": "doc_mock_clarification_1",
                    "type": "需求澄清问题",
                    "stepId": "1.1",
                    "version": "v1.0",
                    "createdAt": "2025-10-29T06:00:00.000Z",
                    "name": "用户登录功能优化-需求澄清问题.md"
                }
            ]
        };
    }

    /**
     * 初始化Mock数据 - 用于开发测试
     */
    initializeMockData() {
        // 首先初始化项目和版本数据
        this.initializeMockProjectAndVersion();

        const flows = this.getAllProcessFlows();

        // 添加新的mock流程 - 用于版本详情页展示
        if (!flows['mock_process_1']) {
            const mockProcess1 = this.createMockProcess1();
            this.saveProcessFlow(mockProcess1);
            console.log('✅ Mock流程 mock_process_1 初始化成功');
        }

        // 检查是否已存在mock数据
        if (flows['process_1730076000000']) {
            console.log('Mock流程数据已存在，跳过初始化');
            return;
        }

        const mockProcessFlow = {
            "id": "process_1730076000000",
            "name": "智能客服系统需求流程",
            "requirement": "开发一个基于AI的智能客服系统，能够自动回答用户常见问题，支持多轮对话，具备情感识别能力，并与现有CRM系统集成",
            "versionId": "version_001",
            "projectId": "project_001",
            "status": "in_progress",
            "currentStep": "1.8",
            "createdAt": "2025-10-20T09:00:00.000Z",
            "updatedAt": "2025-10-28T14:30:00.000Z",
            "steps": {
                "1.1": {
                    "id": "1.1",
                    "name": "需求澄清",
                    "status": "completed",
                    "startedAt": "2025-10-20T09:00:00.000Z",
                    "completedAt": "2025-10-20T15:30:00.000Z",
                    "input": "开发一个基于AI的智能客服系统，能够自动回答用户常见问题，支持多轮对话，具备情感识别能力，并与现有CRM系统集成",
                    "output": "已完成需求澄清，明确了目标用户、核心功能边界、AI能力需求和系统集成要求。生成4类澄清问题：目标用户与使用场景、核心功能边界、数据与集成、AI能力需求。",
                    "agentName": "product-demand-manager-agent",
                    "documents": [
                        {"id": "doc_clarification_1730076000001", "type": "需求澄清问题", "version": "v1.0", "createdAt": "2025-10-20T09:00:00.000Z"},
                        {"id": "doc_analysis_1730076000002", "type": "需求收集澄清分析", "version": "v1.0", "createdAt": "2025-10-20T15:30:00.000Z"}
                    ]
                },
                "1.2": {
                    "id": "1.2",
                    "name": "市场调研",
                    "status": "completed",
                    "startedAt": "2025-10-21T09:00:00.000Z",
                    "completedAt": "2025-10-21T17:00:00.000Z",
                    "input": "需求收集澄清分析文档",
                    "output": "完成市场和竞品调研，识别主要竞争对手（智齿科技、网易七鱼、环信）和差异化机会。建议重点打造情感识别能力和深度CRM集成作为差异化优势。",
                    "agentName": "product-research-analyst-agent",
                    "documents": [
                        {"id": "doc_research_1730162400000", "type": "需求调研分析", "version": "v1.0", "createdAt": "2025-10-21T17:00:00.000Z"}
                    ]
                },
                "1.3": {
                    "id": "1.3",
                    "name": "需求设计",
                    "status": "completed",
                    "startedAt": "2025-10-22T09:00:00.000Z",
                    "completedAt": "2025-10-23T18:00:00.000Z",
                    "input": "需求澄清分析和市场调研报告",
                    "output": "完成PRD v1.0文档编写，包含5大核心功能（智能对话引擎、情感识别与共情、知识库管理、CRM深度集成、人工协同）、用户故事、系统架构设计。",
                    "agentName": "product-demand-manager-agent",
                    "documents": [
                        {"id": "doc_prd_1730335200000", "type": "产品需求文档", "version": "v1.0", "createdAt": "2025-10-23T18:00:00.000Z"}
                    ]
                },
                "1.4": {
                    "id": "1.4",
                    "name": "设计挑战",
                    "status": "completed",
                    "startedAt": "2025-10-24T09:00:00.000Z",
                    "completedAt": "2025-10-24T15:00:00.000Z",
                    "input": "产品需求文档 v1.0",
                    "output": "识别8个关键设计挑战点，包括：情感识别准确率可行性、AI-人工切换体验、Salesforce集成性能、数据隐私合规、知识库维护流程、LLM成本控制、多语言支持、降级方案。",
                    "agentName": "product-demand-challenge-agent",
                    "documents": [
                        {"id": "doc_challenge_1730408400000", "type": "设计挑战报告", "version": "v1.0", "createdAt": "2025-10-24T15:00:00.000Z"}
                    ]
                },
                "1.5": {
                    "id": "1.5",
                    "name": "挑战回应",
                    "status": "completed",
                    "startedAt": "2025-10-24T16:00:00.000Z",
                    "completedAt": "2025-10-25T11:00:00.000Z",
                    "input": "设计挑战报告 v1.0",
                    "output": "针对8个挑战点提供回应方案：采用渐进式准确率目标（MVP 75%→6个月80%）、设计三级转接机制、实施缓存策略、遵循GDPR标准、建立知识库治理流程、制定成本优化策略、MVP仅支持中文、设计完整降级方案。",
                    "agentName": "product-demand-manager-agent",
                    "documents": [
                        {"id": "doc_response_1730462400000", "type": "挑战回应文档", "version": "v1.0", "createdAt": "2025-10-25T11:00:00.000Z"}
                    ]
                },
                "1.6": {
                    "id": "1.6",
                    "name": "人类裁决",
                    "status": "completed",
                    "startedAt": "2025-10-25T14:00:00.000Z",
                    "completedAt": "2025-10-25T17:30:00.000Z",
                    "input": "挑战回应文档 v1.0",
                    "output": "人类决策完成，8个挑战全部通过裁决。6个方案直接通过，2个附带修改意见通过（自动升级触发条件改为连续2次、月预算提升至5万元）。决策团队包括产品总监、客服总监、技术总监、CFO、法务部。",
                    "agentName": null,
                    "documents": [
                        {"id": "doc_decision_1730487000000", "type": "人类裁决结果", "version": "v1.0", "createdAt": "2025-10-25T17:30:00.000Z"}
                    ]
                },
                "1.7": {
                    "id": "1.7",
                    "name": "设计更新",
                    "status": "completed",
                    "startedAt": "2025-10-26T09:00:00.000Z",
                    "completedAt": "2025-10-26T16:00:00.000Z",
                    "input": "人类裁决结果 + 原PRD文档",
                    "output": "根据裁决结果更新PRD至v2.0版本。主要变更：调整情感识别目标（MVP 75%→6个月80%）、优化AI转人工机制（连续2次未能解决自动升级）、调整LLM月预算（3万→5万元）、新增详细降级方案说明。",
                    "agentName": "product-demand-manager-agent",
                    "documents": [
                        {"id": "doc_prd_1730553600000", "type": "产品需求文档", "version": "v2.0", "createdAt": "2025-10-26T16:00:00.000Z"}
                    ]
                },
                "1.8": {
                    "id": "1.8",
                    "name": "人类评估",
                    "status": "in_progress",
                    "startedAt": "2025-10-28T09:00:00.000Z",
                    "completedAt": null,
                    "input": "产品需求文档 v2.0",
                    "output": null,
                    "agentName": null,
                    "documents": []
                },
                "1.9": {
                    "id": "1.9",
                    "name": "文档修改",
                    "status": "pending",
                    "startedAt": null,
                    "completedAt": null,
                    "input": null,
                    "output": null,
                    "agentName": "product-demand-manager-agent",
                    "documents": []
                },
                "1.11": {
                    "id": "1.11",
                    "name": "差异检查",
                    "status": "pending",
                    "startedAt": null,
                    "completedAt": null,
                    "input": null,
                    "output": null,
                    "agentName": null,
                    "documents": []
                },
                "1.12": {
                    "id": "1.12",
                    "name": "文档精炼",
                    "status": "pending",
                    "startedAt": null,
                    "completedAt": null,
                    "input": null,
                    "output": null,
                    "agentName": "product-demand-refine-agent",
                    "documents": []
                },
                "1.13": {
                    "id": "1.13",
                    "name": "强制检查点",
                    "status": "pending",
                    "startedAt": null,
                    "completedAt": null,
                    "input": null,
                    "output": null,
                    "agentName": null,
                    "documents": []
                }
            },
            "documents": [
                {"id": "doc_clarification_1730076000001", "type": "需求澄清问题", "stepId": "1.1", "version": "v1.0", "createdAt": "2025-10-20T09:00:00.000Z"},
                {"id": "doc_analysis_1730076000002", "type": "需求收集澄清分析", "stepId": "1.1", "version": "v1.0", "createdAt": "2025-10-20T15:30:00.000Z"},
                {"id": "doc_research_1730162400000", "type": "需求调研分析", "stepId": "1.2", "version": "v1.0", "createdAt": "2025-10-21T17:00:00.000Z"},
                {"id": "doc_prd_1730335200000", "type": "产品需求文档", "stepId": "1.3", "version": "v1.0", "createdAt": "2025-10-23T18:00:00.000Z"},
                {"id": "doc_challenge_1730408400000", "type": "设计挑战报告", "stepId": "1.4", "version": "v1.0", "createdAt": "2025-10-24T15:00:00.000Z"},
                {"id": "doc_response_1730462400000", "type": "挑战回应文档", "stepId": "1.5", "version": "v1.0", "createdAt": "2025-10-25T11:00:00.000Z"},
                {"id": "doc_decision_1730487000000", "type": "人类裁决结果", "stepId": "1.6", "version": "v1.0", "createdAt": "2025-10-25T17:30:00.000Z"},
                {"id": "doc_prd_1730553600000", "type": "产品需求文档", "stepId": "1.7", "version": "v2.0", "createdAt": "2025-10-26T16:00:00.000Z"}
            ],
            "metadata": {
                "totalSteps": 12,
                "completedSteps": 7,
                "inProgressSteps": 1,
                "pendingSteps": 4,
                "progressPercentage": 58,
                "estimatedCompletion": "2025-11-05",
                "teamMembers": [
                    {"role": "产品总监", "name": "张伟", "involvement": "需求澄清、裁决"},
                    {"role": "客服总监", "name": "李明", "involvement": "需求澄清、裁决"},
                    {"role": "技术总监", "name": "王强", "involvement": "裁决、技术评审"}
                ]
            }
        };

        // 保存mock数据
        flows[mockProcessFlow.id] = mockProcessFlow;
        localStorage.setItem(this.storageKey, JSON.stringify(flows));
        console.log('✅ Mock流程数据初始化成功:', mockProcessFlow.id);
    }

    /**
     * 初始化Mock项目和版本数据
     */
    initializeMockProjectAndVersion() {
        // 初始化项目数据
        const projectsKey = 'projects';
        let projects = localStorage.getItem(projectsKey);

        if (!projects) {
            projects = {};
        } else {
            projects = JSON.parse(projects);
        }

        // 检查项目是否已存在
        if (!projects['project_001']) {
            projects['project_001'] = {
                id: 'project_001',
                name: 'AI智能客服平台',
                description: '基于人工智能的新一代客服系统，提供智能对话、情感识别、多渠道接入等功能',
                status: 'active',
                createdAt: '2025-10-01T00:00:00.000Z',
                updatedAt: '2025-10-28T14:30:00.000Z',
                owner: '张伟',
                team: ['张伟', '李明', '王强', '陈静', '刘芳'],
                tags: ['AI', '客服', '企业级'],
                versions: ['version_001']
            };
            localStorage.setItem(projectsKey, JSON.stringify(projects));
            console.log('✅ Mock项目数据初始化成功: project_001');
        }

        // 初始化版本数据
        const versionsKey = 'versions';
        let versions = localStorage.getItem(versionsKey);

        if (!versions) {
            versions = {};
        } else {
            versions = JSON.parse(versions);
        }

        // 检查版本是否已存在
        if (!versions['version_001']) {
            versions['version_001'] = {
                id: 'version_001',
                projectId: 'project_001',
                name: 'v1.0 MVP版本',
                description: '首个可用版本，实现核心功能：智能对话、情感识别、知识库管理、CRM集成、人工协同',
                status: 'in_progress',
                createdAt: '2025-10-15T00:00:00.000Z',
                updatedAt: '2025-10-28T14:30:00.000Z',
                estimatedReleaseDate: '2025-11-30',
                owner: '张伟',
                progress: 58,
                processes: ['process_1730076000000'],
                milestones: [
                    {
                        name: '需求确认',
                        status: 'completed',
                        date: '2025-10-25'
                    },
                    {
                        name: '设计评审',
                        status: 'in_progress',
                        date: '2025-10-30'
                    },
                    {
                        name: '开发完成',
                        status: 'pending',
                        date: '2025-11-20'
                    },
                    {
                        name: '测试验收',
                        status: 'pending',
                        date: '2025-11-25'
                    }
                ]
            };
            localStorage.setItem(versionsKey, JSON.stringify(versions));
            console.log('✅ Mock版本数据初始化成功: version_001');
        }
    }
}

// 导出服务实例
const processFlowService = new ProcessFlowService();

// 自动初始化Mock数据（开发环境）
if (typeof window !== 'undefined') {
    // 确保在DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            processFlowService.initializeMockData();
        });
    } else {
        // DOM已经加载完成，直接初始化
        processFlowService.initializeMockData();
    }
}
