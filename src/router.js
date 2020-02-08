import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    base: process.env.BASE_URL,
    routes: [
        /*
        {
            alias: '/',
            name: 'poll',
            path: '/poll/:id?/:step?',
            props: {
                maxWidth: 500
            },
            component: () => import('@/Views/Index')
        }
        */
    ]
});

export default router;
