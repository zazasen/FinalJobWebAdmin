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
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''" v-for="(route,index) in routes" :key="index">
                            <template slot="title">
                                <i style="margin-right: 5px" :class="route.icon"></i>
                                <span>{{route.name}}</span>
                            </template>
                            <el-menu-item :index="childItem.path"
                                          v-for="(childItem,index_j) in route.children"
                                          :key="index_j">
                                {{childItem.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
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
</style>
