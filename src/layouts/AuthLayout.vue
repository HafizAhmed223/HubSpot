<template>
    <div class="auth-layout">
      <div class="auth-container">
        <router-view /> <!-- Render the current route's component here -->
      </div>
    </div>
  </template>
  
  <style scoped>
  .auth-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--background-color);
    font-family: var(--font-family);
  }
  
  .auth-container {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    background-color: var(--container-bg-color);
    color: var(--text-color);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  