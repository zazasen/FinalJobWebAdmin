<template>
    <div style="position: absolute;width:100%;height: 100%;">
        <el-container style="height: 100%">
            <el-header class="header">
                <div class="title">
                    <span>前端用户中心</span>
                    <el-button style="margin-left: 60px;color: #FAFAFA;height: 100%;" type="text" :icon="butIcon"
                               @click="isCollapseChange"/>
                </div>
                <el-dropdown @command="commandEvent">
                  <span class="el-dropdown-link">
                      <i><img :src="user.userFace" class="userFace"></i>
                    {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <!--                        <el-dropdown-item command="userCenter">用户中心</el-dropdown-item>-->
                        <el-dropdown-item command="signIn">{{signShow}}</el-dropdown-item>
                        <!--                        <el-dropdown-item command="setting">设置</el-dropdown-item>-->
                        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px" style="height: 100%">
                    <el-menu router :default-active="this.$route.path" background-color="#F5F5F5" style="height: 100%"
                             :collapse="isCollapse">
                        <el-submenu :index="index+''" v-for="(route,index) in routes" :key="index">
                            <template slot="title">
                                <i :class="route.icon"></i>
                                <span>{{route.name}}</span>
                            </template>

                            <el-menu-item :index="childItem.path" v-for="(childItem,index_j) in route.children"
                                          :key="index_j">
                                <i :class="childItem.icon"></i>
                                <span>{{childItem.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator="/" v-if="!breadItem()">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view style="margin-top: 15px"/>
                    <div class="homePage" v-if="breadItem()">
                        这是一个大大的主页
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../utils/RequestUtil";

    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("currentUser")),
                // routes:this.$router.options.routes
                butIcon: "el-icon-s-fold",
                isCollapse: false,
                signType: null,
                signShow: "签到",
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            }
        },
        mounted() {
            this.getSignType();
        },
        methods: {
            getSignType() {
                getRequest("/attendance/sign/signType").then(resp => {
                    if (resp) {
                        this.signType = resp.data.type;
                        if (this.signType == 1) {
                            this.signShow = "签退";
                        }
                        if (this.signType == 0) {
                            this.signShow = "签到";
                        }
                    }
                })
            },
            isCollapseChange() {
                if (this.isCollapse) {
                    this.butIcon = "el-icon-s-fold";
                } else {
                    this.butIcon = "el-icon-s-unfold";
                }
                this.isCollapse = !this.isCollapse;
            },
            breadItem() {
                return this.$router.currentRoute.path == '/home';
            },
            commandEvent(param) {
                if (param == 'logout') {
                    this.$confirm('是否退出登录', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        getRequest("/logout");
                        window.sessionStorage.removeItem("currentUser");
                        this.$store.commit('initRoutes', []);
                        this.$router.replace("/");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已退出登录'
                        });
                    });
                }
                if (param == 'signIn') {
                    if(this.signType == 0){
                        postRequest("/attendance/sign/signIn")
                    }
                    if (this.signType == 1) {
                        postRequest("/attendance/sign/signOut")
                    }
                }
            }
        }
    }
</script>

<style>
    .title {
        font-size: 20px;
        font-family: 华文楷体;
        color: white;
        height: 100%;
    }

    .header {
        background-color: #4876FF;
        /*弹性布局*/
        display: flex;
        /*垂直居中*/
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .userFace {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-right: 8px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #ffffff;
        display: flex;
        align-items: center;
    }

    .homePage {
        font-size: 30px;
        font-family: 华文行楷;
        color: #52b2ff;
        text-align: center;
        padding-top: 50px;
    }
</style>
