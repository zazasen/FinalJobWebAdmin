import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import {initMenu} from "./utils/menuUtil";

Vue.config.productionTip = false;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    if (to.path == "/" || to.path == '/recruitPublish' || to.path == '/showDetail') {
        next();
    } else {
        if (window.sessionStorage.getItem('currentUser')) {
            initMenu(router, store);
            next();
        } else {
            let path = to.path;
            next("/?redirece=" + path);
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
