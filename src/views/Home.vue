<template>
    <div>
        <el-container>
            <el-header class="header">
                <div class="title">
                    人力资源管理系统
                </div>
                <el-dropdown @command="commandEvent">
                  <span class="el-dropdown-link">
                      <i><img :src="user.userFace" class="userFace"></i>
                    {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userCenter">用户中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router :default-active="this.$route.path">
                        <el-submenu :index="index+''" v-for="(route,index) in routes" :key="index">
                            <template slot="title">
                                <i style="margin-right: 8px;color: #409EFF" :class="route.icon"></i>
                                <span>{{route.name}}</span>
                            </template>

                            <el-menu-item :index="childItem.path" v-for="(childItem,index_j) in route.children" :key="index_j">
                                <i style="margin-right: 8px;color: #409EFF" :class="childItem.icon"></i>
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
    import {getRequest} from "../utils/RequestUtil";

    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("currentUser")),
                // routes:this.$router.options.routes
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            }
        },
        methods: {
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
            }
        }
    }
</script>

<style>
    .mainHeader{

    }
    .mainContain{
        background-color: #F5F5F5;
    }
    .title {
        font-size: 30px;
        font-family: 华文行楷;
        color: white;
        margin-left: 20px;
    }

    .header {
        background-color: #409EFF;
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
