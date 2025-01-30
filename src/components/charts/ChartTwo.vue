<template>
    <div class="chart-container">
        <canvas ref="chart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
    name: "ChartTwo",
    mounted() {
        const ctx = this.$refs.chart.getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Product A", "Product B", "Product C", "Product D"],
                datasets: [
                    {
                        label: "Sales",
                        data: [30, 20, 40, 35],
                        backgroundColor: [
                            "#ff7a59",
                            "#ffb45b",
                            "#ffcc5c",
                            "#ffd973",
                        ],
                        borderWidth: 1,
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