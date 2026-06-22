let chart = null;

export function renderChart(labels, data) {
    const canvas = document.getElementById("history-chart");
    const ctx = canvas.getContext("2d");
    if (chart) chart.destroy()

    const gradientFill = (ctx) => {
        const chartArea = ctx.chart.chartArea;
        if (!chartArea) return null; // chart not ready yet

        const gradient = ctx.chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "rgba(206, 247, 57, 0.6)");
        gradient.addColorStop(1, "#171719");
        return gradient;
    };
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    data,
                    borderColor: "#cef739",
                    backgroundColor: gradientFill,
                    borderWidth: 2,
                    fill: true,
                    tension: 0,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#cef739",
                    pointHoverBorderColor: "#0a0a0a",
                    pointBackgroundColor: "#cef739",
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: "#0a0a0a",
                    titleColor: "#cef739",
                    bodyColor: "#ffffff",
                    borderColor: "#cef739",
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    cornerRadius: 6,
                    caretSize: 6,
                    caretPadding: 8,
                    titleFont: {
                        family: "JetBrains Mono",
                        size: 14,
                        weight: "bold"
                    },
                    bodyFont: {
                        family: "JetBrains Mono",
                        size: 12,
                        weight: "normal"
                    },
                    callbacks: {
                        title: (context) => {
                            return context[0].label.toUpperCase();
                        },
                        label: (context) => {
                            return `Rate: ${context.parsed.y.toFixed(4)}`;
                        },
                        afterLabel: () => {
                            return "↗ trend";
                        }
                    }
                }

            },
            scales: {
                x: {
                    ticks: {
                        color: "#9d9d9d",
                        maxTicksLimit: 5,
                        font: {
                            family: "JetBrains Mono",
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: "#9d9d9d",
                        maxTicksLimit: 3,
                        font: {
                            family: "JetBrains Mono",
                            size: 10
                        },
                        callback: function (value) {
                            return value.toFixed(4);
                        }
                    },
                    grid: {
                        display: true,
                        color: "rgba(255,255,255,0.06)",
                        borderDash: [6, 4],
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    })
}

const labels = [
    "Apr 14",
    "Apr 21",
    "Apr 28",
    "May 05",
    "May 12"
];

const data = [
    0.8512,
    0.8541,
    0.8498,
    0.8573,
    0.8530
];


renderChart(labels, data);