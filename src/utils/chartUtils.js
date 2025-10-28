// ProductCoCreate AI - 图表工具函数

/**
 * 创建流程概览图表
 * @param {string} canvasId - Canvas元素ID
 * @param {object} data - 图表数据
 */
export function createProcessOverviewChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * 创建任务分布饼图
 * @param {string} canvasId - Canvas元素ID
 * @param {object} data - 图表数据
 */
export function createTaskDistributionChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 格式化图表数据
 * @param {array} rawData - 原始数据
 * @returns {object} 格式化后的图表数据
 */
export function formatChartData(rawData) {
    return {
        labels: rawData.map(item => item.label),
        datasets: [{
            data: rawData.map(item => item.value),
            backgroundColor: rawData.map(item => item.color)
        }]
    };
}

console.log('chartUtils.js 已加载');
