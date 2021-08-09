import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from'vue-table-with-tree-grid'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem("token")
  //console.log(config)
  NProgress.start()
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
