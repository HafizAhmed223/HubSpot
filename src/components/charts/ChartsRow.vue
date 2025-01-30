<template>
    <div class="charts-row">
        <div class="chart-box">
            <ChartOne />
        </div>
        <div class="chart-box">
            <ChartTwo />
        </div>
    </div>
</template>

<script>
import ChartOne from "./ChartOne.vue";
import ChartTwo from "./ChartTwo.vue";

export default {
    name: "ChartsRow",
    components: {
        ChartOne,
        ChartTwo,
    },
};
</script>

<style scoped>
.charts-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.chart-box {
    flex: 1;
    background-color: var(--container-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder {
    color: var(--text-secondary);
    font-size: 0.9rem;
}
</style>