import Vue from "vue"
import App from "./components/App.vue"
import VueRouter from "vue-router"
import Vuex from "vuex"
import createRouter from './router'
import '@/assets/scss/app.scss'
import createStore from './store/store'

// Development tools
Vue.config.devtools = process.env.NODE_ENV === 'development'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = createRouter()
router.push({ path: "/login" })

const store = createStore();

const app = new Vue({
  el: '#app',
  router,
  render: ce => ce(App),
  store
})

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
