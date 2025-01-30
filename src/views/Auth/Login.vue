<template>
    <div class="login-page">
        <h1 class="app-name">{{ appName }}</h1>
        <h2 class="welcome-message">Welcome Back!</h2>
        <p class="subtitle">Grow better with HubSpot</p>
        <div class="button-wrapper">
            <button class="login-button" @click="redirectToLogin">
                <i class="fab fa-hubspot"></i> Login with HubSpot
            </button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Login',
    data() {
        return {
            appName: `${import.meta.env.VITE_APP_NAME}`,
            loginUrl: `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        };
    },
    methods: {
        redirectToLogin() {
            window.location.href = this.loginUrl;
        },
    },
};
</script>


<style scoped>
.login-page {
    text-align: center;
    color: var(--text-color);
    font-family: var(--font-family);
}

.app-name {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.welcome-message {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--accent-color);
}

.subtitle {
    margin-bottom: 2rem;
    color: #b3b3b3;
}

.button-wrapper {
    display: flex;
    justify-content: center;
}

.login-button {
    background-color: var(--logout-bg);
    color: var(--button-text-color);
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
}

.login-button i {
    margin-right: 8px;
    font-size: 1.2rem;
}

.login-button:hover {
    background-color: var(--logout-hover-bg);
    color: #ffffff;
}
</style>
