import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from "../views/Home";
import Chat from "../views/chat/Chat";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        show: false,
    }, {
        path: '/home',
        name: 'Home',
        component: Home,
        show: true,
    }, {
        path: '/chat',
        name: '在线聊天',
        component: Chat,
        show: true,
    },
];

const router = new VueRouter({
    routes
});

export default router
