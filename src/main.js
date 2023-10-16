import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css';

import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://1.13.159.135/api/private/v1'
axios.interceptors.request.use(config => {
    console.log(config);
    // 最后一定 return config
    config.headers.Authorization = window.sessionStorage.getItem('token')
    console.log(config.headers.Authorization);
    return config
})
Vue.prototype.$http = axios

// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 时间过滤器
Vue.filter('dataFormat', function(params) {
    const dt = new Date(params)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')