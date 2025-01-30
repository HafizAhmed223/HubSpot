<template>
    <div class="ui-layout-v2">
        <!-- Global Header -->
        <Header />

        <!-- Main Content -->
        <main class="main-content">
            <router-view />
        </main>

        <!-- Global Footer -->
        <Footer />
    </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
    name: "UILayoutV2",
    components: {
        Header,
        Footer,
    },
};
</script>

<style scoped>
.ui-layout-v2 {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    padding: 20px;
    background-color: var(--background-color);
}
</style>