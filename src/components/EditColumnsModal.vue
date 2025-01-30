<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-container">
      <header class="modal-header">
        <h2>Edit Columns</h2>
        <button class="close-button" @click="closeModal">×</button>
      </header>
      <section class="modal-body">
        <div v-for="field in allFields" :key="field.fieldKey" class="field-checkbox">
          <input type="checkbox" :id="field.fieldKey" v-model="localSelectedFields" :value="field.fieldKey" />
          <label :for="field.fieldKey">{{ field.fieldLabel }}</label>
        </div>
      </section>
      <footer class="modal-footer">
        <button class="cancel-button" @click="closeModal">Cancel</button>
        <button class="apply-button" @click="applyChanges">Apply</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditColumnsModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    allFields: {
      type: Array,
      required: true,
    },
    preferences: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localSelectedFields: [],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    applyChanges() {
      const updatedFields = this.allFields.filter((field) =>
        this.localSelectedFields.includes(field.fieldKey)
      );
      this.$emit("apply", updatedFields);
    },
    syncLocalSelectedFields() {
      this.localSelectedFields = this.preferences.map((pref) => pref.fieldKey);
    },
  },
  watch: {
    preferences: "syncLocalSelectedFields",
    allFields: "syncLocalSelectedFields",
  },
  mounted() {
    this.syncLocalSelectedFields();
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 71, 91, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: #ffffff;
  color: var(--text-color);
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  font-family: var(--font-family);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
}

.close-button:hover {
  color: var(--text-secondary);
}

.modal-body {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.field-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.field-checkbox label {
  margin-left: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button,
.apply-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button {
  background-color: #ffffff;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: var(--link-hover-bg);
  color: #ffffff;
}

.apply-button {
  background-color: var(--logout-bg);
  color: #000000;
  border: none;
  transition: background-color 0.2s;
}

.apply-button:hover {
  background-color: var(--logout-hover-bg);
  color: #ffffff;
}
</style>
