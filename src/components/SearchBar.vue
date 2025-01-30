<template>
    <form class="search-bar" @submit.prevent="submitSearch">
        <input type="text" v-model="searchTerm" placeholder="Write any query here" aria-label="Search input" />
        <button type="submit">Search</button>
    </form>
</template>


<script>
export default {
    name: "SearchBar",
    data() {
        return {
            searchTerm: "",
        };
    },
    methods: {
        submitSearch() {
            this.$emit("search-submitted", this.searchTerm);
        },
    },
};
</script>

<style scoped>
.search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background-color: var(--container-bg-color);
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-bar input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-family: var(--font-family);
    font-size: 1rem;
    color: var(--text-color);
    background-color: var(--background-color);
    outline: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-bar input::placeholder {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

/* .search-bar input:focus {
    transform: scale(1.02);
    box-shadow: 0 0 6px var(--link-active-bg);
} */

.search-bar button {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--link-active-bg), var(--logout-hover-bg));
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: var(--font-family);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
    outline: none;
}

.search-bar button:hover {
    transform: scale(1.0);
    background: linear-gradient(135deg, var(--logout-hover-bg), var(--link-hover-bg));
}

/* .search-bar button:active {
    transform: scale(0.18);
} */
</style>

