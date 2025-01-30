import Vue from 'vue';
import Router from 'vue-router';

// Import your components
import Login from '../views/Auth/Login.vue';
import LoginCallback from '../views/Auth/LoginCallback.vue';
import Dashboard from '../views/Dashboard.vue';
import Contacts from '../views/Contacts.vue';
import Companies from '../views/Companies.vue';
import Deals from '../views/Deals.vue';
import Products from '../views/Products.vue';
// import Quotes from '../views/Quotes.vue';
// import Payments from '../views/Payments.vue';
// import Invoices from '../views/Invoices.vue';
// import Subscriptions from '../views/Subscriptions.vue';
import ComingSoon from '../views/ComingSoon.vue';

Vue.use(Router);

const routes = [
    {
        path: '/subscriptions',
        name: 'Subscriptions',
        component: ComingSoon,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/invoices',
        name: 'Invoices',
        component: ComingSoon,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/payments',
        name: 'Payments',
        component: ComingSoon,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/quotes',
        name: 'Quotes',
        component: ComingSoon,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            layout: 'AuthLayout',
            noAuth: true
        },
    },
    {
        path: '/login-success',
        name: 'LoginCallback',
        component: LoginCallback,
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        }
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: Contacts,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/companies',
        name: 'Companies',
        component: Companies,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/deals',
        name: 'Deals',
        component: Deals,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: {
            layout: 'UILayoutV2',
            requiresAuth: true
        },
    }
];

const router = new Router({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('hubspotToken');
    if (to.meta.requiresAuth && !token) {
        next('/login'); // Redirect to login if not authenticated
    } else if (to.meta.noAuth && token) {
        next('/');
    } else {
        next();
    }
});


export default router;
