import Vue from 'vue'
//import App from './App.vue'
import operatormode from './components/operator-mode.vue';
import managermode from './components/manager-mode.vue';

Vue.config.productionTip = false

const routes = {
  '' : operatormode,
  '#': operatormode,
  '#manager': managermode
}
let vue = new Vue({
  data: {
    currentRoute : window.location.hash
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || operatormode
    }
  },
  render(h) { return h(this.ViewComponent) }
}).$mount('#app')

window.onhashchange = function() {
  vue.currentRoute = window.location.hash;
}