import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import 'amfe-flexible'
import './utils/dayjs'

Vue.config.productionTip = false
Vue.use(Vant)
new Vue({
  router,
  store,
  // Vant,
  render: h => h(App)
}).$mount('#app')
