<template>
  <div class="coming-soon-container">
    <!-- Display loader for 1 second -->
    <div v-if="isLoading" class="loader-wrapper">
      <div class="spinner"></div>
    </div>

    <!-- After 1 second, show the main content -->
    <div v-else class="content-wrapper">
      <h1>Coming Soon</h1>
      <p>We’re working hard to finish the development of this page. Stay tuned!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComingSoon",
  data() {
    return {
      isLoading: true, // control loader visibility
    };
  },
  mounted() {
    // Simulate a 1-second load
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
};
</script>

<style scoped>
.coming-soon-container {
  background-color: var(--background-color);
  min-height: calc(100vh - 60px);
  /* Fill viewport minus any header height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: var(--font-family);
}

/* Loader Styles */
.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  /* or any height you prefer */
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  /* Light gray */
  border-top: 4px solid var(--link-active-bg);
  /* Spin color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Spin animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.content-wrapper {
  background-color: var(--container-bg-color);
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: 40px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.content-wrapper h1 {
  color: var(--text-color);
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.content-wrapper p {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 0;
}
</style>