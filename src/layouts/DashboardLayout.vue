<template>
    <div class="main-page">
      <Sidebar @toggle-sidebar="toggleSidebar" :collapsed="isSidebarCollapsed" />
      <div class="content" :class="{ 'content-collapsed': isSidebarCollapsed }">
        <Header />
        <div class="main-content-wrapper">
          <div class="main-content">
            <router-view /> 
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue';
  import Sidebar from '../components/Sidebar.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    components: {
      Header,
      Sidebar,
      Footer,
    },
    data() {
      return {
        isSidebarCollapsed: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      },
    },
  };
  </script>
  
  <style scoped>
  .main-page {
    display: flex;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--background-color);
    font-family: var(--font-family);
  }
  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--container-bg-color);
    color: var(--text-color);
    overflow: hidden;
    transition: margin-left 0.3s ease;
    margin-left: 260px; /* Expanded sidebar width */
  }
  
  .content.content-collapsed {
    margin-left: 60px; /* Collapsed sidebar width */
  }
  
  .main-content-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .main-content {
    padding: 20px;
    height: 100%;
  }
  
  .content Footer {
    flex-shrink: 0;
  }
  </style>
  