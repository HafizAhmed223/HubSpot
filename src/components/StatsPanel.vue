<template>
    <div class="stats-panel">
        <!-- Loader -->
        <div v-if="loading" class="loader">
            <div class="spinner"></div>
            <span>Loading stats...</span>
        </div>

        <!-- Stats Section -->
        <div v-else class="stats-grid">
            <div v-for="(stat, index) in formattedStats" :key="index" class="stat-box">
                <strong>{{ stat.value }}</strong>
                <div class="stat-label">{{ stat.label }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getStats } from "../services/statsService";

export default {
    name: "StatsPanel",
    data() {
        return {
            formattedStats: [],
            loading: true,
        };
    },
    methods: {
        async fetchStats() {
            try {
                const token = localStorage.getItem("hubspotToken");
                const response = await getStats(token);

                const apiStats = response?.stats[0] || {};
                this.formattedStats = [
                    { label: "Contacts", value: apiStats.total_contacts || 0 },
                    { label: "Deals", value: apiStats.total_deals || 0 },
                    { label: "Companies", value: apiStats.total_companies || 0 },
                    { label: "Products", value: apiStats.total_products || 0 },
                ];

                this.loading = false;
            } catch (error) {
                console.error("Error fetching stats:", error);
                this.loading = false;
            }
        },
    },
    mounted() {
        this.fetchStats();
    },
};
</script>

<style scoped>
.stats-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Grid layout for stats boxes */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    /* Dynamically adjust columns */
    gap: 1rem;
}

/* Loader Styles */
.loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 150px;
    text-align: center;
    color: var(--text-secondary);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--link-active-bg);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Stat Box Styling */
.stat-box {
    background-color: var(--container-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 8px;
    text-align: center;
    font-size: 0.85rem;
}

.stat-box strong {
    font-size: 1rem;
    color: var(--text-color);
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.stats-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Responsive grid layout */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    /* Adjusts columns automatically */
    gap: 1rem;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        /* Smaller columns for mobile */
        gap: 0.75rem;
    }
}

@media (max-width: 480px) {
    .stats-grid {
        grid-template-columns: 1fr;
        /* Single-column layout on very small screens */
    }
}
</style>