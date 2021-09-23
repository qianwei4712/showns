import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/idea.css';
import './assets/blog/blog.css';
import './assets/chest/chest.css';
import BlogCommon from './assets/blog/blog.js';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(BlogCommon);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
