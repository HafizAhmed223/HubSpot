<template>
    <div>
        <component :is="layout">
            <router-view />
        </component>
    </div>
</template>

<script>
import AuthLayout from './layouts/AuthLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import UILayoutV2 from './layouts/UILayoutV2.vue';

export default {
    data() {
        return {
            layouts: {
                AuthLayout,
                DashboardLayout,
                UILayoutV2
            },
        };
    },
    computed: {
        layout() {
            console.log('this.$route.meta-', this.$route);
            const layoutName = this.$route?.meta?.layout || 'AuthLayout';
            console.log('this.layoutName', layoutName);
            return this.layouts[layoutName] || AuthLayout;
        },
    },
};
</script>