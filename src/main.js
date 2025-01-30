import Vue from 'vue';
import App from './App.vue'
import Vuetify from 'vuetify';
import MMStorybook from '@mammoth_developer/mm-storybook'
import 'vuetify/dist/vuetify.min.css';
import '@mammoth_developer/mm-storybook/dist/style.css'
import '@fortawesome/fontawesome-free/css/all.css';
import './variables.css';
import store from './store';
import router from './router';

const mmStorybookOptions = {}

Vue.config.productionTip = false;
Vue.use(Vuetify);

const vuetify = new Vuetify();

Vue.use(MMStorybook, mmStorybookOptions)
Vue.use(mmStorybookOptions.mmToasts, { vuetify })
Vue.use(mmStorybookOptions.mmBanners)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
