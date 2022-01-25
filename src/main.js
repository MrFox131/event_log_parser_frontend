import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'bootstrap'


window.$ = window.jQuery = require('jquery')
createApp(App).use(store).use(router).mount('#app')
