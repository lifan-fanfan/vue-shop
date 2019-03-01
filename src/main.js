import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import zkTable from 'vue-table-with-tree-grid'
import moment from 'moment'
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.use(zkTable)
axios.defaults.baseURL = 'http://127.0.0.1:8765/api/private/v1/'
Vue.prototype.$http = axios
Vue.use(ElementUI)
// 添加一个请求拦截器
axios.interceptors.request.use(
  function(config) {
    let token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    NProgress.start();
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(function (response) {
  NProgress.done()
  return response;
}, function (error) {
  return Promise.reject(error);
});
Vue.filter('sjFormat', function(val) {
  return moment(val).format('YYYY-MM-DD h:mm:ss')
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
