<template>
    <div class="hubspot-contacts-container">
        <div class="action-bar">
            <div class="table-actions">
                <button class="action-button" @click="toggleEditColumnsModal">
                    <i class="icon-columns"></i> Columns
                </button>
                <div class="dropdown">
                    <button class="export-button dropdown-toggle" @click="exportToCSV">
                        Export
                    </button>
                    <!-- <ul class="dropdown-menu">
                        <li>
                            <button class="dropdown-item" @click="$emit('export-all')">
                                Export All
                            </button>
                        </li>
                    </ul> -->
                </div>
            </div>
        </div>

        <div class="table-wrapper scroll-container" ref="scrollContainer" @scroll="handleScroll"
            style="max-height: 450px; overflow-y: auto;">
            <table class="hubspot-table">
                <thead>
                    <tr>
                        <th class="checkbox-column">
                            <input type="checkbox" @change="toggleSelectAll" v-model="selectAll" />
                        </th>
                        <th v-for="field in selectedFields" :key="field.fieldKey" @click="sortBy(field.fieldKey)"
                            class="sortable-header">
                            {{ field.fieldLabel }}
                            <span class="sort-icon">
                                <i v-if="sortKey === field.fieldKey && sortOrder === 'asc'" class="icon-chevron-up"></i>
                                <i v-else-if="sortKey === field.fieldKey && sortOrder === 'desc'"
                                    class="icon-chevron-down"></i>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredItems" :key="item.id"
                        :class="{ selected: selectedItems.includes(item.id) }" @click="toggleItemSelection(item.id)">
                        <td class="checkbox-column">
                            <input type="checkbox" :checked="selectedItems.includes(item.id)" @click.stop
                                @change="toggleItemSelection(item.id)" />
                        </td>
                        <td v-for="field in selectedFields" :key="field.fieldKey" class="table-cell"
                            :data-tooltip="item[field.fieldKey] || '--'">
                            {{ truncateText(item[field.fieldKey], 30) }}
                        </td>
                    </tr>

                    <!-- Bottom loader -->
                    <tr v-if="isLoadingMore" class="loading-row">
                        <td :colspan="selectedFields.length + 1" style="text-align: center; padding: 16px;">
                            <div class="spinner"></div>
                            <span>Loading more...</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Columns Modal -->
        <div v-if="isEditColumnsModalOpen" class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Edit Columns</h2>
                    <button class="close-button" @click="toggleEditColumnsModal">×</button>
                </div>
                <div class="modal-body">
                    <div v-for="field in allFields" :key="field.fieldKey" class="field-checkbox">
                        <input type="checkbox" :value="field.fieldKey" v-model="localSelectedFields" />
                        <label>{{ field.fieldLabel }}</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-button" @click="toggleEditColumnsModal">
                        Cancel
                    </button>
                    <button class="apply-button" @click="applyColumnChanges">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let searchTimeoutId = null;

export default {
    name: "GenericTable",
    props: {
        items: Array,
        allFields: Array,
        selectedFields: Array,
        nextPage: String,
        searchPlaceholder: {
            type: String,
            default: "Search items",
        },
        itemLabelPlural: {
            type: String,
            default: "items",
        },
        isLoadingMore: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            searchQuery: "",
            sortKey: "",
            sortOrder: "asc",
            selectedItems: [],
            selectAll: false,
            localSelectedFields: [],
            isEditColumnsModalOpen: false,
        };
    },
    watch: {
        // Whenever searchQuery changes, debounce for 3 seconds
        searchQuery(newVal) {
            // Clear any previous timer
            clearTimeout(searchTimeoutId);

            // If user cleared input => emit empty search immediately
            if (!newVal) {
                // Optionally, you can decide to emit empty string or do nothing
                this.$emit("search-contacts", "");
                return;
            }

            // Only do the search if >= 3 chars
            if (newVal.length >= 3) {
                searchTimeoutId = setTimeout(() => {
                    this.$emit("search-contacts", newVal);
                }, 3000);
            }
            // else do nothing until 3 characters
        },
        selectedFields: {
            immediate: true,
            handler(newVal) {
                if (newVal && Array.isArray(newVal)) {
                    this.localSelectedFields = newVal.map((field) => field.fieldKey);
                }
            },
        },
    },
    computed: {
        filteredItems() {
            // Remove local filtering by searchQuery
            // Keep sorting if needed
            let filtered = [...this.items];
            if (this.sortKey) {
                filtered.sort((a, b) => {
                    const aValue = a[this.sortKey] || "";
                    const bValue = b[this.sortKey] || "";
                    return this.sortOrder === "asc"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                });
            }
            return filtered;
        },
    },
    methods: {
        toggleEditColumnsModal() {
            this.isEditColumnsModalOpen = !this.isEditColumnsModalOpen;
        },
        applyColumnChanges() {
            const updatedPreferences = this.allFields.filter((field) =>
                this.localSelectedFields.includes(field.fieldKey)
            );
            this.$emit("update-fields", updatedPreferences);
            this.isEditColumnsModalOpen = false;
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedItems = this.items.map((i) => i.id);
            } else {
                this.selectedItems = [];
            }
        },
        toggleItemSelection(itemId) {
            const index = this.selectedItems.indexOf(itemId);
            if (index === -1) {
                this.selectedItems.push(itemId);
            } else {
                this.selectedItems.splice(index, 1);
            }
        },
        sortBy(fieldKey) {
            if (this.sortKey === fieldKey) {
                this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
            } else {
                this.sortKey = fieldKey;
                this.sortOrder = "asc";
            }
        },
        truncateText(text, maxLength) {
            if (!text) return "--";
            const stringText = String(text);
            return stringText.length > maxLength
                ? stringText.substring(0, maxLength) + "..."
                : stringText;
        },
        exportToCSV() {
            const headers = this.selectedFields.map((field) => field.fieldLabel);
            const rows = this.items.map((item) =>
                this.selectedFields.map((field) =>
                    (item[field.fieldKey] || "").toString().replace(/"/g, '""')
                )
            );

            let csvContent = headers.join(",") + "\n";
            rows.forEach((row) => {
                csvContent += row.join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${this.itemLabelPlural}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        /**
         * Handle scroll-based infinite loading
         */
        handleScroll() {
            if (!this.nextPage) return;
            const container = this.$refs.scrollContainer;
            if (!container) return;

            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 50) {
                // Reached near bottom => ask parent to fetch next page
                this.$emit("fetch-next-page");
            }
        },
    },
};
</script>




<style scoped>
/* You can keep your existing styles, just be sure the .table-wrapper is scrollable. */

/* Container */
.hubspot-contacts-container {
    background-color: var(--container-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font-family);
    color: var(--text-color);
    padding: 16px;
}

/* Action Bar */
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.search-container {
    position: relative;
}

.search-input {
    width: 300px;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: #ffffff;
    color: var(--text-color);
}

.icon-search {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.table-actions {
    display: flex;
    gap: 12px;
    position: relative;
}

.action-button,
.export-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: #ffffff;
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 500;
}

.action-button:hover,
.export-button:hover {
    background-color: var(--link-hover-bg);
    color: #ffffff;
}

.export-button {
    background-color: var(--logout-bg);
    color: #000000;
}

.export-button:hover {
    background-color: var(--logout-hover-bg);
    color: #ffffff;
}

/* Dropdown */
.dropdown {
    position: relative;
}

.dropdown-toggle {
    padding: 8px 16px;
    background-color: var(--logout-bg);
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.dropdown-toggle:hover {
    background-color: var(--logout-hover-bg);
    color: #fff;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    z-index: 1000;
    list-style: none;
    padding: 0;
    margin: 0;
    min-width: 120px;
    display: none;
}

.dropdown:hover .dropdown-menu {
    display: block;
}

.dropdown-item {
    padding: 10px 16px;
    font-size: 14px;
    color: var(--text-color);
    background-color: #fff;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.dropdown-item:hover {
    background-color: var(--link-hover-bg);
    color: #fff;
}

/* Scrollable table wrapper */
.table-wrapper.scroll-container {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    /* max-height: 450px; overflow-y: auto; <= done inline above */
}

.hubspot-table {
    width: 100%;
    border-collapse: collapse;
}

.hubspot-table thead th {
    background-color: var(--sidebar-bg);
    color: var(--sidebar-text);
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    text-transform: uppercase;
    border-bottom: 2px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1;
}

.hubspot-table tbody tr:nth-child(odd) {
    background-color: #f9fafb;
}

.hubspot-table tbody tr:nth-child(even) {
    background-color: #ffffff;
}

.hubspot-table tbody tr:hover {
    background-color: var(--link-hover-bg);
    color: #ffffff;
}

.hubspot-table td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(51, 71, 91, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Modal Container */
.modal-container {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
    width: 400px;
    max-width: 90%;
    padding: 24px;
    color: var(--text-color);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.modal-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
}

.close-button {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s;
}

.close-button:hover {
    color: var(--text-secondary);
}

/* Modal Body */
.modal-body {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 16px;
}

.field-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.field-checkbox input {
    margin-right: 8px;
}

/* Modal Footer */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-button {
    padding: 8px 16px;
    border: 1px solid var(--border-color);
    background-color: #ffffff;
    border-radius: 4px;
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 500;
}

.cancel-button:hover {
    background-color: var(--link-hover-bg);
    color: #ffffff;
}

.apply-button {
    padding: 8px 16px;
    border: none;
    background-color: var(--logout-bg);
    border-radius: 4px;
    color: #000000;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 600;
}

.apply-button:hover {
    background-color: var(--logout-hover-bg);
    color: #ffffff;
}

.loading-row .spinner {
    margin-right: 8px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #888;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>