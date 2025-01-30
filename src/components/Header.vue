<template>
  <nav class="header">
    <!-- Left Section (Title) -->
    <div class="header-title">
      <h4>Hubspot - CBT</h4>
    </div>

    <!-- Right Section (Profile and Dropdown) -->
    <div class="header-profile" ref="profileSection">
      <!-- Profile Icon + Placeholder -->
      <div class="profile-wrapper" @click="toggleDropdown" role="button" tabindex="0" aria-haspopup="true"
        :aria-expanded="dropdownVisible" @keydown.enter="toggleDropdown">
        <!-- Profile Image or Placeholder -->
        <img v-if="profileImage" :src="profileImage" alt="User Profile Image" class="profile-img"
          @error="onImageError" />
        <div v-else class="profile-placeholder">{{ initials }}</div>

        <!-- Dropdown Arrow Icon -->
        <span class="dropdown-icon">
          <svg width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M192 384l320 320 320-320z" />
          </svg>
        </span>
      </div>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div v-if="dropdownVisible" class="dropdown-menu" role="menu" ref="dropdownMenu">
          <p class="username">{{ userName }}</p>
          <button @click="logout" class="logout-button" role="menuitem">
            Logout
          </button>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      dropdownVisible: false,
      userName: "John Doe",
      profileImage: "https://via.placeholder.com/40",
    };
  },
  computed: {
    initials() {
      if (!this.userName) return "";
      const parts = this.userName.split(" ");
      return parts.map(name => name.charAt(0)).join("").toUpperCase();
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    logout() {
      localStorage.removeItem('hubspotToken');
      this.$router.push('/login');
    },
    onImageError() {
      this.profileImage = "";
    },
    handleClickOutside(event) {
      // Check if the click is outside the profile wrapper AND dropdown
      const profileSection = this.$refs.profileSection;
      if (profileSection && !profileSection.contains(event.target)) {
        this.dropdownVisible = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() { // Vue 2 lifecycle hook
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
/* Transitions (optional) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Header Base Styles */
.header {
  background-color: var(--sidebar-bg);
  padding: 15px 30px;
  color: var(--sidebar-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-family);
}

/* Title Styles */
.header-title h4 {
  margin: 0;
  font-weight: normal;
}

/* Profile Section */
.header-profile {
  position: relative;
  /* For dropdown positioning */
  display: flex;
  align-items: center;
}

/* Profile Wrapper */
.profile-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;
  /* for keyboard focus */
}

/* Profile Image or Placeholder */
.profile-img,
.profile-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: var(--text-secondary);
}

/* Initials if no image */
.profile-placeholder {
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  text-transform: uppercase;
}

/* Dropdown Icon */
.dropdown-icon {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--sidebar-text);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 50px;
  /* Adjust based on icon size */
  right: 0;
  background-color: var(--container-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 10px 15px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* Username Styles */
.username {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: bold;
}

/* Logout Button */
.logout-button {
  background-color: var(--logout-bg);
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: var(--logout-hover-bg);
}
</style>
