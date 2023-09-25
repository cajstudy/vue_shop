import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css';

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://1.13.159.135/api/private/v1/'
Vue.prototype.$http = axios

// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')