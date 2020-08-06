import Vue from 'vue'
import App from './App.vue'

// import 'bulma/css/bulma.css'
import './bulma-custom.scss'
// import '@fortawesome/fontawesome-free/js/all'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
