import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/RequestUtil";
import "../utils/stomp";
import SockJS from "../utils/sockjs";
import {Notification} from 'element-ui';

Vue.use(Vuex);

const now = new Date();

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        users: [],
        // 选中用户
        currentSession: null,
        currentUser: JSON.parse(window.sessionStorage.getItem("currentUser")),
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        INIT_CURRENT_USER(state, user) {
            state.currentUser = user;
        },
        changeCurrentSession(state, currentSession) {
            state.currentSession = currentSession;
            Vue.set(state.isDot, state.currentUser.username + "#" + currentSession.username, false);
        },
        // 往store里加入消息记录
        addMessage(state, obj) {
            // 张三发送给王五的消息key：zhangsan#wangwu
            let msg = state.sessions[state.currentUser.username + "#" + obj.to];
            if (!msg) {
                // state.sessions[state.currentUser.username + "#" + obj.to] = [];
                Vue.set(state.sessions, state.currentUser.username + "#" + obj.to, []);
            }
            state.sessions[state.currentUser.username + "#" + obj.to].push({
                content: obj.content,
                date: new Date(),
                self: !obj.noSelf
            });
            console.info(state.sessions);
        },
        INIT_DATA(state) {
            //历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_USER(state, data) {
            state.users = data;
        },
        initRoutes(state, data) {
            state.routes = data;
        }
    },
    actions: {
        initData(context) {
            // 初始化
            context.commit('INIT_DATA');
            getRequest("/chat/getAllUsers").then(resp => {
                if (resp) {
                    context.commit('INIT_USER', resp.data);
                }
            })
        },
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    let receiveMsg = JSON.parse(msg.body);
                    if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
                        Notification.info({
                            title: '[' + receiveMsg.fromRealName + ']发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substring(0, 10) : receiveMsg.content,
                            position: 'bottom-right'
                        });
                        Vue.set(context.state.isDot, context.state.currentUser.username + "#" + receiveMsg.from, true);
                    }
                    receiveMsg.noSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg);
                })
            }, error => {

            })
        },
    },
    modules: {}
});
store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
});

export default store;
