<template>
  <div class="sidebar" :class="{ collapsed: collapsed }">
    <div class="sidebar-container">
      <!-- Sidebar Header with Title and Toggle Button -->
      <div class="sidebar-header">
        <span class="header-text" v-if="!collapsed">Hubspot - CBT</span>
        <div class="toggle-btn" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-navs">
        <!-- Dashboard Link -->
        <router-link to="/" class="nav-link" exact-active-class="active-link">
          <i class="fas fa-home"></i>
          <span v-if="!collapsed">Dashboard</span>
        </router-link>

        <!-- CRM Collapsible Section -->
        <div class="main-item" @click="toggleCMS">
          <div class="main-item-content">
            <i class="fas fa-cog"></i>
            <span v-if="!collapsed" class="section-text">CRM</span>
          </div>
          <div v-if="!collapsed" class="chevron">
            <i class="fas" :class="cmsExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </div>
        </div>
        <div v-if="cmsExpanded && !collapsed" class="sub-items">
          <router-link to="/contacts" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-address-book"></i>
            <span>Contacts</span>
          </router-link>
          <router-link to="/companies" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-building"></i>
            <span>Companies</span>
          </router-link>
          <router-link to="/deals" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-file-alt"></i>
            <span>Deals</span>
          </router-link>
        </div>

        <!-- Commerce Collapsible Section -->
        <div class="main-item" @click="toggleCommerce">
          <div class="main-item-content">
            <i class="fas fa-shopping-cart"></i>
            <span v-if="!collapsed" class="section-text">Commerce</span>
          </div>
          <div v-if="!collapsed" class="chevron">
            <i class="fas" :class="commerceExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </div>
        </div>
        <div v-if="commerceExpanded && !collapsed" class="sub-items">
          <router-link to="/products" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-box"></i>
            <span>Products</span>
          </router-link>
          <router-link to="/quotes" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-file-invoice"></i>
            <span>Quotes</span>
          </router-link>
          <router-link to="/payments" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-money-bill"></i>
            <span>Payments</span>
          </router-link>
          <router-link to="/invoices" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-file-invoice-dollar"></i>
            <span>Invoices</span>
          </router-link>
          <router-link to="/subscriptions" class="sub-link" exact-active-class="active-link">
            <i class="fas fa-receipt"></i>
            <span>Subscriptions</span>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Footer with Logout -->
    <div class="sidebar-footer">
      <button class="logout-button" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      appName: `${import.meta.env.VITE_APP_NAME}`,
      cmsExpanded: true,
      marketingExpanded: true,
      commerceExpanded: false, // New state for Commerce section
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('hubspotToken');
      this.$router.push('/login');
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    toggleCMS() {
      if (!this.collapsed) {
        this.cmsExpanded = !this.cmsExpanded;
      }
    },
    toggleMarketing() {
      if (!this.collapsed) {
        this.marketingExpanded = !this.marketingExpanded;
      }
    },
    toggleCommerce() {
      if (!this.collapsed) {
        this.commerceExpanded = !this.commerceExpanded;
      }
    },
  },
};
</script>


<style scoped>
/* Reset link defaults for router-links: no blue color or underlines */
a.nav-link,
a.sub-link,
.main-item {
  color: var(--sidebar-text);
  text-decoration: none;
}

/* Sidebar Base */
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--sidebar-text);
  font-family: var(--font-family);
  font-size: 0.9rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* Sidebar Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid var(--border-color);
}

.header-text {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Toggle Button */
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  color: var(--sidebar-text);
  transition: background-color 0.3s;
  border-radius: 4px;
}

.toggle-btn:hover {
  background-color: var(--link-hover-bg);
}

/* Navigation */
.sidebar-navs {
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Links */
.nav-link {
  display: flex;
  align-items: center;
  padding: var(--link-padding);
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 500;
}

.nav-link i {
  margin-right: 12px;
  font-size: var(--icon-size);
}

.sidebar.collapsed .nav-link {
  justify-content: center;
}

.sidebar.collapsed .nav-link i {
  margin-right: 0;
}

.nav-link:hover {
  background-color: var(--link-hover-bg);
  color: #ffffff;
}

.active-link {
  background-color: var(--link-active-bg);
  color: #000000;
  font-weight: 600;
}

/* Main Items (CMS, Marketing) */
.main-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--link-padding);
  color: var(--sidebar-text);
  cursor: pointer;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.main-item-content {
  display: flex;
  align-items: center;
}

.main-item i {
  margin-right: 12px;
  font-size: var(--icon-size);
}

.section-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Chevron at the far right */
.chevron {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.main-item:hover {
  background-color: var(--link-hover-bg);
  color: #ffffff;
}

/* When collapsed, center main items icons and remove chevron */
.sidebar.collapsed .main-item {
  justify-content: center;
}

.sidebar.collapsed .main-item-content i {
  margin-right: 0;
}

.sidebar.collapsed .chevron {
  display: none;
}

/* Sub-items */
.sub-items {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  gap: 4px;
}

.sub-link {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.sub-link i {
  margin-right: 8px;
  font-size: 0.85rem;
}

.sub-link:hover {
  background-color: var(--link-hover-bg);
  color: #ffffff;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 0.80rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.logout-button {
  width: 100%;
  padding: 8px;
  background-color: var(--logout-bg);
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: normal;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: var(--logout-hover-bg);
  color: #ffffff;
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: var(--sidebar-bg);
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}
</style>