import { createRouter, createWebHistory } from 'vue-router';
import PublicList from '../views/PublicList.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ProposalForm from '../views/ProposalForm.vue';

const routes = [
    { path: '/', component: PublicList },
    { path: '/login', component: Login },
    { 
        path: '/dashboard', 
        component: Dashboard, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/propostas/nova', 
        component: ProposalForm, 
        meta: { requiresAuth: true } 
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;