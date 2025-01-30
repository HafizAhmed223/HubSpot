<template>
    <div class="chart-container">
        <canvas ref="chart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
    name: "ChartOne",
    mounted() {
        const ctx = this.$refs.chart.getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May"],
                datasets: [
                    {
                        label: "Example Line Chart",
                        data: [10, 20, 15, 30, 25],
                        borderColor: "#ff7a59",
                        backgroundColor: "rgba(255, 122, 89, 0.2)",
                        borderWidth: 2,
                        tension: 0.4, // Makes the line smooth
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            color: "#33475b",
                        },
                    },
                },
            },
        });
    },
};
</script>

<style scoped>
.chart-container {
    position: relative;
    height: 100%;
    /* Ensure it fits in the chart-box */
    width: 100%;
}
</style>