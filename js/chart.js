let chart = null;

export function renderChart(labels, data) {
    const ctx = document.getElementById("history-chart")
    if(chart) chart.destroy()
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    data,
                    fill: true,
                    tension: .4
                }
            ]
        }
    })
}