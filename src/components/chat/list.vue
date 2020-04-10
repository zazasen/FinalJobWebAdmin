<template>
    <el-scrollbar style="height: 100%" id="list">
        <div :style="height">
            <ul style="padding-left: 0px">
                {{load(users)}}
                <li v-for="item in users"
                    :class="{ active: currentSession ? item.username === currentSession.username:false}"
                    v-on:click="changeCurrentSession(item)" style="height: 50px">
                    <el-badge :is-dot="isDot[user.username+'#'+item.username]">
                        <img class="avatar" :src="item.userFace" :alt="item.realName">
                    </el-badge>
                    <p class="name">{{item.realName}}</p>
                </li>
            </ul>
        </div>
    </el-scrollbar>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'list',
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("currentUser")),
                height: 'height:100%',
            }
        },
        computed: mapState([
            'users',
            'isDot',
            'currentSession'
        ]),
        methods: {
            load(val) {
                if(val && val.length != 0){
                    this.height = 'height:' + val.length * 65 + 'px';
                }
            },
            changeCurrentSession: function (currentSession) {
                this.$store.commit('changeCurrentSession', currentSession)
            }
        },
    }
</script>

<style lang="scss" scoped>

    #list {
        li {
            padding: 0px 15px;
            border-bottom: 1px solid #292C33;
            cursor: pointer;
            list-style: none;

            &:hover {
                background-color: rgba(255, 255, 255, 0.03);
            }
        }

        li.active { /*注意这个是.不是冒号:*/
            background-color: rgba(255, 255, 255, 0.1);
        }

        .avatar {
            border-radius: 2px;
            width: 30px;
            height: 30px;
            vertical-align: middle;
        }

        .name {
            display: inline-block;
            margin-left: 15px;
            /*margin-top: 0px;*/
            /*margin-bottom: 0px;*/
        }
    }
</style>
