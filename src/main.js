
import Vue from 'vue';
import App from '@/App.vue';

// import router from './router';

// import bugsnag from '@bugsnag/js';
// import bugsnagVue from '@bugsnag/plugin-vue';

Vue.config.productionTip = false;

/*
if(process.env.NODE_ENV !== 'development') {
    bugsnag({
        apiKey: '06c52a8df4f52e47e3133deb7d313a98',
        notifyReleaseStages: ['production', 'staging']
    }).use(bugsnagVue, Vue);
}
*/

export default new Vue({
    render: h => h(App)
}).$mount('#app');
