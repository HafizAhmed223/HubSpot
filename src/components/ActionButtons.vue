<template>
    <div class="action-buttons">
        <button @click="download">Download</button>
    </div>
</template>

<script>
export default {
    name: "ActionButtons",
    methods: {
        download() {
            // Emit or directly handle the download logic
            this.$emit("download-clicked");
        },
        explore() {
            // Emit or directly handle explore logic
            this.$emit("explore-clicked");
        },
    },
};
</script>

<style scoped>
.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.action-buttons button {
    background-color: var(--container-bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 4px;
    font-family: var(--font-family);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.action-buttons button:hover {
    background-color: #f0f0f0;
}
</style>