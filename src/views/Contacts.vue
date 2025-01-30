<template>
  <div class="contacts-page">
    <h1>Contacts</h1>

    <p v-if="!loading && !error && totalRecords" class="total-records">
      Total records: {{ totalRecords }}
    </p>
    <!-- Full-page loader only for initial load (when we have no data yet) -->
    <div v-if="loading && contacts.length === 0" class="initial-loader">
      Loading contacts...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else>
      <div class="limit-selector">
        <label for="records-per-page">Records per page: </label>
        <div class="custom-select-wrapper">
          <select id="records-per-page" v-model="limit" @change="changeLimit" class="custom-select">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="arrow"></span>
        </div>
      </div>



      <!-- GenericTable with infinite scroll support -->
      <GenericTable :items="contacts" :all-fields="allFields" :selected-fields="selectedFields" :next-page="nextPage"
        :searchPlaceholder="'Search contacts'" :itemLabelPlural="'contacts'" :isLoadingMore="isLoadingMore"
        @fetch-next-page="fetchNextPage" @update-fields="updatePreferences" @export-all="handleExportAll"
        @search-contacts="onSearchContacts" />
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Export Confirmation</h2>
          <button class="close-button" @click="closeExportModal">&times;</button>
        </div>

        <div class="modal-body">
          <div v-if="exportLoading">Fetching data, please wait...</div>
          <div v-else>
            <p>You are about to export <strong>{{ totalRecords }}</strong> records. Do you want to proceed?</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="closeExportModal">Cancel</button>
          <button class="export-button" :disabled="exportLoading" @click="confirmExport">
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getContacts,
  fetchContactFields,
  fetchPreferences,
  savePreferences,
  exportAllContacts,
} from "../services/hubspotService";
import GenericTable from "../components/GenericTable.vue";
import * as XLSX from "xlsx";

export default {
  name: "Contacts",
  components: { GenericTable },
  setup() {
    const contacts = ref([]);
    const allFields = ref([]);
    const selectedFields = ref([]);
    const loading = ref(true);
    const isLoadingMore = ref(false);
    const error = ref(null);
    const nextPage = ref(null);
    const limit = ref(10);

    // Track the current search term (from child)
    const currentSearch = ref("");

    const showExportModal = ref(false);
    const exportLoading = ref(false);
    const totalRecords = ref(0);
    const exportData = ref([]);

    const isFetching = ref(false);

    const fetchData = async (pageToken = null) => {
      if (isFetching.value) return;
      const token = localStorage.getItem("hubspotToken");
      if (!token) {
        error.value = "User not authenticated";
        loading.value = false;
        return;
      }

      try {
        isFetching.value = true;
        const numericLimit = Number(limit.value);

        if (pageToken) {
          // If fetching next page
          isLoadingMore.value = true;
        } else {
          // If initial or search refresh
          loading.value = true;
          contacts.value = [];  // reset
        }

        const contactsData = await getContacts(
          token,
          numericLimit,
          pageToken,
          currentSearch.value // Pass the current search here
        );

        if (pageToken) {
          contacts.value.push(...(contactsData.results || []));
        } else {
          contacts.value = contactsData.results || [];
        }

        nextPage.value = contactsData.nextPage || null;
        totalRecords.value = contactsData.total || 0;
      } catch (err) {
        error.value = "Failed to fetch data";
        console.error(err);
      } finally {
        loading.value = false;
        isLoadingMore.value = false;
        isFetching.value = false;
      }

      // On first successful fetch, get fields and user preferences if not loaded yet
      if (allFields.value.length === 0) {
        try {
          const token = localStorage.getItem("hubspotToken");
          const fields = await fetchContactFields(token);
          allFields.value = fields;

          const preferences = await fetchPreferences("contacts");
          selectedFields.value = preferences.map((pref) => {
            const matched = fields.find((f) => f.fieldKey === pref.fieldKey);
            return matched || { fieldKey: pref.fieldKey, fieldLabel: pref.fieldKey };
          });
        } catch (err) {
          console.error(err);
        }
      }
    };

    const fetchNextPage = async () => {
      if (nextPage.value) {
        await fetchData(nextPage.value);
      }
    };

    // Called when columns are updated in child
    const updatePreferences = async (updatedFields) => {
      const token = localStorage.getItem("hubspotToken");
      try {
        await savePreferences("contacts", updatedFields, token);
        selectedFields.value = updatedFields;
      } catch (err) {
        console.error("Error saving preferences:", err);
      }
    };

    const changeLimit = () => {
      loading.value = true;
      contacts.value = [];
      nextPage.value = null;
      fetchData();
    };

    // Called from child GenericTable when user stops typing (3-sec debounce) with >=3 chars
    const onSearchContacts = (searchTerm) => {
      currentSearch.value = searchTerm;
      // Reset to first page whenever a new search is made
      nextPage.value = null;
      fetchData();
    };

    // Export flow unchanged ...
    const handleExportAll = async () => {
      showExportModal.value = true;
      exportLoading.value = true;
      try {
        const token = localStorage.getItem("hubspotToken");
        const response = await exportAllContacts(token);
        exportData.value = response.results || [];
        totalRecords.value = response.total || 0;
      } catch (err) {
        console.error("Error fetching export data:", err);
        error.value = "Failed to fetch export data. Please try again.";
      } finally {
        exportLoading.value = false;
      }
    };

    const closeExportModal = () => {
      showExportModal.value = false;
    };

    const confirmExport = () => {
      const worksheet = XLSX.utils.json_to_sheet(exportData.value);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      XLSX.writeFile(workbook, "contacts_export.xlsx");
      closeExportModal();
    };

    onMounted(() => {
      fetchData();
    });

    return {
      contacts,
      allFields,
      selectedFields,
      loading,
      isLoadingMore,
      error,
      nextPage,
      limit,

      showExportModal,
      exportLoading,
      totalRecords,
      exportData,

      fetchNextPage,
      updatePreferences,
      changeLimit,
      handleExportAll,
      closeExportModal,
      confirmExport,
      onSearchContacts,
    };
  },
};
</script>


<style scoped>
.contacts-page {
  padding: 20px;
  color: var(--text-color);
  font-family: var(--font-family);
  background-color: var(--container-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contacts-page h1 {
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: 600;
}

.limit-selector {
  margin-bottom: 10px;
}

.contacts-page {
  padding: 20px;
  color: var(--text-color);
  font-family: var(--font-family);
  background-color: var(--container-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contacts-page h1 {
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: 600;
}

.limit-selector {
  margin-bottom: 10px;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Container */
.modal-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.close-button:hover {
  color: var(--link-hover-bg);
}

/* Modal Body */
.modal-body {
  font-size: 16px;
  color: var(--text-color);
  line-height: 1.5;
  margin-bottom: 20px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  border-radius: 4px;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.cancel-button:hover {
  background-color: var(--link-hover-bg);
  color: #ffffff;
}

.export-button {
  padding: 10px 16px;
  border: none;
  background-color: var(--logout-bg);
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-weight: bold;
}

.export-button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.export-button:hover:not(:disabled) {
  background-color: var(--logout-hover-bg);
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.limit-selector label {
  font-weight: 500;
  color: var(--text-color);
}

.limit-selector select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--container-bg-color);
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.limit-selector select:hover {
  background-color: var(--link-hover-bg);
  color: #fff;
}

.limit-selector select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.limit-selector {
  margin-bottom: 1rem;
}

.contacts-page {
  padding: 20px;
  color: var(--text-color);
  font-family: var(--font-family);
  background-color: var(--container-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contacts-page h1 {
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: 600;
}

.limit-selector {
  margin-bottom: 1rem;
}

.initial-loader {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error-message {
  color: red;
  text-align: center;
  margin: 1rem 0;
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.limit-selector label {
  font-weight: 500;
  color: var(--text-color);
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
}

.custom-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--container-bg-color);
  font-size: 14px;
  color: var(--text-color);
  appearance: none;
  /* Hides the native dropdown arrow */
  width: 120px;
  cursor: pointer;
}

.custom-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  /* Prevents clicks on the arrow */
  display: inline-block;
  width: 8px;
  height: 8px;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  border-color: var(--text-color) transparent transparent transparent;
  transition: transform 0.2s ease-in-out;
}

.custom-select:focus+.arrow {
  transform: translateY(-50%) rotate(180deg);
}
.total-records {
  margin-bottom: 20px;
  font-size: 16px;
  color: var(--text-secondary);
}
</style>
