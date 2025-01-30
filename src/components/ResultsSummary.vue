<template>
    <div class="results-summary">
        <span>Result of: <p>{{ `"${queryText}"` }}</p></span>
        <span class="row-count">{{ totalRows }} rows</span>
    </div>
</template>

<script>
export default {
    name: "ResultsSummary",
    props: {
        queryText: {
            type: String,
            default: "View all my contacts",
        },
        totalRows: {
            type: Number,
            default: 0,
        },
    },
};
</script>

<style scoped>
.results-summary {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
    margin-left: 1rem;
    font-family: var(--font-family);
    font-size: 0.95rem;
}

.results-summary span {
    display: flex; /* Ensures inline content within the <span> stays horizontal */
    align-items: center; /* Centers content inside the <span> */
}

.results-summary p {
    margin: 0; /* Removes default margin from the <p> tag */
}

.results-summary .row-count {
    color: var(--text-secondary);
}

.small-link {
    color: var(--text-color);
    text-decoration: underline;
    cursor: pointer;
}
</style>