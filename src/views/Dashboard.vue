<template>
  <div class="dashboard-page">
    <!-- Top Section: Stats + Charts -->
    <div class="top-section">
      <div class="left-panel">
        <StatsPanel />
      </div>
      <div class="right-panel">
        <ChartsRow />
      </div>
    </div>

    <!-- Conditional Search and Results Summary -->
    <SearchBar @search-submitted="onSearchDashboard" />
    <div v-if="currentSearch">
      <ResultsSummary :queryText="currentSearch" :totalRows="totalRecords" />
    </div>

    <!-- Conditional States -->
    <div v-if="!hasSearched && !loading && items.length === 0" class="no-query-message">
      <!-- 1) No search yet -->
      <p>No data to display. Please enter a query to search.</p>
    </div>

    <div v-else-if="loading && items.length === 0" class="table-loader">
      <!-- 2) Loader for first load -->
      <div class="spinner"></div>
      <span>Loading data...</span>
    </div>

    <div v-else-if="error" class="error-message">
      <!-- 3) Error message -->
      {{ error }}
    </div>

    <div v-else>
      <!-- 4) Table Content -->
      <div v-if="items.length === 0" class="empty-search-message">
        <!-- 4a) No results after search -->
        <p>No results found for "{{ currentSearch }}".</p>
      </div>
      <div v-else>
        <!-- 4b) Render table -->
        <CustomTableV2 :items="items" :all-fields="allFields" :selected-fields="selectedFields" :next-page="nextPage"
          :itemLabelPlural="'records'" :isLoadingMore="isLoadingMore" @fetch-next-page="fetchNextPage"
          @update-fields="updatePreferences" />
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from "vue";
import StatsPanel from "../components/StatsPanel.vue";
import ChartsRow from "../components/charts/ChartsRow.vue";
import SearchBar from "../components/SearchBar.vue";
import GenericTable from "../components/GenericTable.vue";
import ResultsSummary from "../components/ResultsSummary.vue";
import CustomTableV2 from "../components/CustomTableV2.vue";
import { dynamicSearch } from "../services/statsService";

export default {
  name: "Dashboard",
  components: {
    StatsPanel,
    ChartsRow,
    SearchBar,
    GenericTable,
    ResultsSummary,
    CustomTableV2
  },
  setup() {
    // Core data
    const items = ref([]);
    const allFields = ref([]);
    const selectedFields = ref([]);
    const totalRecords = ref(0);

    // States
    const loading = ref(false);
    const isLoadingMore = ref(false);
    const error = ref(null);
    const nextPage = ref(null);

    // Search
    const currentSearch = ref("");
    const hasSearched = ref(false); // Tracks whether a search has been made

    // Pagination
    const limit = ref(10);
    let isFetching = false;

    /**
     * Fetch data for the table, optionally using pageToken for pagination
     */
    const fetchData = async (pageToken = null) => {
      if (isFetching) return;
      const token = localStorage.getItem("hubspotToken");
      if (!token) {
        error.value = "User not authenticated";
        return;
      }

      try {
        isFetching = true;

        // If we have a pageToken => infinite scroll
        if (pageToken) {
          isLoadingMore.value = true;
        } else {
          // new search or first load
          loading.value = true;
          items.value = [];
        }

        const response = await dynamicSearch(token, currentSearch.value, pageToken);

        if (pageToken) {
          // append to existing items
          items.value.push(...(response.results || []));
        } else {
          // new set of data
          items.value = response.results || [];
        }

        nextPage.value = response.nextPage || null;
        totalRecords.value = response.total || 0;

        // Only update fields during the first page load
        if (!pageToken && allFields.value.length === 0) {
          allFields.value = response.allFields || [];
          selectedFields.value = (response.allFields || []).map((field) => ({
            fieldKey: field.fieldKey,
            fieldLabel: field.fieldLabel,
          }));
        }
      } catch (err) {
        error.value = "Search failed. Please try again.";
        console.error("Fetch error =>", err);
      } finally {
        loading.value = false;
        isLoadingMore.value = false;
        isFetching = false;
      }
    };

    /**
     * Search handler - called when user types a query
     */
    const onSearchDashboard = (searchTerm) => {
      currentSearch.value = searchTerm || "";
      hasSearched.value = true; // Mark that a search has been made
      nextPage.value = null; // Reset pagination
      fetchData(); // Fetch first page of data
    };

    /**
     * Infinite scroll handler
     */
    const fetchNextPage = () => {
      if (nextPage.value) {
        fetchData(nextPage.value); // Fetch next page
      }
    };

    /**
     * Update column preferences
     */
    const updatePreferences = (updatedFields) => {
      selectedFields.value = updatedFields;
    };

    return {
      items,
      allFields,
      selectedFields,
      totalRecords,
      loading,
      isLoadingMore,
      error,
      nextPage,
      currentSearch,
      hasSearched,

      onSearchDashboard,
      fetchNextPage,
      updatePreferences,
    };
  },
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 16px;
  font-family: var(--font-family);
  background-color: var(--background-color);
  min-height: 100vh;
}

/* Top section: Stats + Charts */
.top-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 2;
  display: flex;
  gap: 1rem;
}

/* No data messages */
.no-query-message,
.empty-search-message {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1rem;
  margin-top: 2rem;
}

/* Loader (matching StatsPanel) */
.table-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 1rem;
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

/* Error styling */
.error-message {
  color: red;
  text-align: center;
  font-size: 1rem;
}

/* Show total records after table */
.total-records {
  color: var(--text-secondary);
}
</style>
