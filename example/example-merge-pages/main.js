import Vue from 'vue'
import App from './App'

import PAGES from 'config/pages';

console.log(PAGES);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
