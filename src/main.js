import './static/sdk/ald-stat'
import Vue from 'vue'
import App from './App'
import store from './store'
import api from '@/services/api'
import './App.css'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$api = api
App.mpType = 'app'

const app = new Vue({
  ...App
}).$mount()

export default {
  config: {
    pages: ['^pages/Home/index']
  }
}
