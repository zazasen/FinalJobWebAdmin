<template>
    <div>
        <div>
            <el-input v-model="queryForm.realName" placeholder="员工姓名" style="width: 200px;margin-right: 10px"/>
            <el-input v-model="queryForm.username" placeholder="登录账号" style="width: 200px;margin-right: 10px"/>
            <el-input v-model="queryForm.workId" placeholder="工号" style="width: 200px;margin-right: 10px"/>
            <el-button type="success" @click="queryUserData">查询</el-button>
        </div>
        <div>
            <el-table :data="queryData" stripe style="width: 1000px;margin-top: 10px"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="id" label="id" width="50" align="center"/>
                <el-table-column prop="realName" label="姓名" width="250" align="center"/>
                <el-table-column prop="workId" label="工号" width="100" align="center"/>
                <el-table-column prop="username" label="登录账号" width="250" align="center"/>
                <el-table-column prop="enabledStr" label="账号状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enabled === true ? 'success' : 'danger'">{{scope.row.enabledStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button @click="editAccount(scope.row)" type="text" size="small">账号操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="width: 1000px">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :page-sizes="[5, 8, 10, 20]" :page-size="pageSize"
                               layout="sizes, prev, pager, next, jumper, ->, total"
                               :total=total style="margin-top: 20px">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="账号设置" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

            <el-form label-width="80px" :model="updateForm">
                <el-form-item label="账号密码">
                    <el-input v-model="updateForm.password" placeholder="账号密码设置" style="width: 200px" show-password/>
                </el-form-item>
                <el-form-item label="分配角色">
                    <el-select multiple v-model="updateForm.roleIds" filterable placeholder="请选择" style="width: 200px">
                        <el-option v-for="item in roles" :key="item.id" :label="item.roleZh" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-switch v-model="updateForm.enabled" active-text="启用" inactive-text="禁用"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdate">取 消</el-button>
                <el-button type="primary" @click="defineEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "roleManager",
        data() {
            return {
                queryForm: {
                    realName: "",
                    username: "",
                    workId: ""
                },
                updateForm: {
                    id: "",
                    password: "",
                    roleIds: [],
                    enabled: "",
                },
                roles: null,
                pageIndex: 1,
                pageSize: 5,
                queryData: null,
                total: null,
                loading: false,
                dialogVisible: false
            }
        },
        mounted() {
            this.initUser();
            this.initRoles();
        },
        methods: {
            handleSizeChange(val){
                this.pageSize = val;
                this.initUser();
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.initUser();
            },
            editAccount(row) {
                this.updateForm.roleIds = [];
                this.updateForm.id = "";
                this.updateForm.password = "";
                let assign = Object.assign({}, row);
                this.updateForm.id = assign.id;
                this.updateForm.enabled = assign.enabled;
                for (let i = 0; i < assign.roles.length; i++) {
                    this.updateForm.roleIds[i] = assign.roles[i].id;
                }
                this.updateForm.password = assign.password;
                this.dialogVisible = true;
            },
            queryUserData() {
                this.initUser();
            },
            handleClose() {
                this.dialogVisible = false;
            },
            cancelUpdate() {
                this.dialogVisible = false;
            },
            defineEdit() {
                postRequest("/access/user/updateUserAccount", this.updateForm).then(resp => {
                    if (resp) {
                        this.initUser();
                        this.dialogVisible = false;
                    }
                });
            },
            initUser() {
                this.loading = true;
                this.queryForm.pageIndex = this.pageIndex;
                this.queryForm.pageSize = this.pageSize;
                postRequest("/access/user/queryUsers", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.queryData = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            initRoles() {
                let params = {};
                getRequest("/access/user/getAllRoles", params).then(resp => {
                    this.roles = resp.data
                })
            }
        }
    }
</script>

<style>

</style>
