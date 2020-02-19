<template>
    <div>
        <div>
            <el-input v-model="queryData.roleName" @keydown.enter.native="queryRole"
                      placeholder="角色名称" style="width: 200px;margin-right: 10px"/>
            <el-input v-model="queryData.roleZh" @keydown.enter.native="queryRole"
                      placeholder="角色中文名称" style="width: 200px;margin-right: 10px"/>
            <el-button @click="queryRole">查询</el-button>
            <el-button type="success" @click="initMenus">添加</el-button>
            <el-button type="danger" :disabled="disabled" @click="mulDel">删除</el-button>
        </div>
        <div>
            <el-table :data="roleData" border stripe style="width: 100%;margin-top: 10px"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      @selection-change="handleSelectionChange"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column prop="id" label="id" width="100" align="center"/>
                <el-table-column prop="roleName" label="角色名" width="250" align="center"/>
                <el-table-column prop="roleZh" label="角色中文名称" width="250" align="center"/>
                <el-table-column prop="createTime" label="创建时间" align="center"/>
                <el-table-column prop="remark" label="备注" align="center"/>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text">修改</el-button>
                        <el-button type="text" style="color: red" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;margin-top: 10px">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="pageSizes"
                        :page-size="page.pageSize"
                        layout="sizes, prev, pager, next, jumper, ->, total"
                        :total=total>
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加角色" :visible.sync="dialogVisible" width="40%" :show-close="false"
                   :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="角色" prop="roleName" style="width: 80%">
                    <el-input v-model="ruleForm.roleName" placeholder="请输入角色英文名"/>
                </el-form-item>
                <el-form-item label="角色中文名" prop="roleZh" style="width: 80%">
                    <el-input v-model="ruleForm.roleZh" placeholder="请输入角色中文名"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="width: 80%">
                    <el-input v-model="ruleForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="菜单授权">
                    <el-tree :data="menuData" show-checkbox node-key="id" :default-expanded-keys="defaultExpandedKeys"
                             :props="defaultProps" style="margin-top: 10px;" :default-checked-keys="defaultCheckedKeys"
                             ref="tree">
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "userManager",
        data() {
            return {
                loading: false,
                type: 0,
                multipleSelection: null,
                menuData: [],
                disabled: true,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                queryData:{
                    roleName: '',
                    roleZh: '',
                },
                roleData: null,
                total: 0,
                defaultCheckedKeys: [],
                defaultExpandedKeys: [1],
                page: {
                    pageSize: 8,
                    pageIndex: 1,
                },
                pageSizes: [5, 8, 10, 20],
                dialogVisible: false,
                ruleForm: {
                    roleName: '',
                    roleZh: '',
                    remark: '',
                    selectKeys: []
                },
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色英文名', trigger: 'blur'}
                    ],
                    roleZh: [
                        {required: true, message: '请输入角色中文名', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            mulDel() {
                this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {};
                    params.ids = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        params.ids[i] = this.multipleSelection[i].id;
                    }
                    postRequest("/access/role/delMulByIds", params).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                if (val.length > 0) {
                    this.multipleSelection = val;
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            },
            initMenus() {
                this.dialogVisible = true;
                this.type = 0;
                getRequest("/access/role/getAllMenuWithChildren").then(resp => {
                    if (resp) {
                        this.menuData = resp.data;
                    }
                })
            },
            handleDelete(row) {
                this.$confirm('此操作将删除 <span style="color:red">'+row.roleName+'</span> 角色,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    let params = {};
                    params.id = row.id;
                    postRequest("/access/role/delRoleById", params).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleClick(row) {
                this.ruleForm.roleName = row.roleName;
                this.ruleForm.roleZh = row.roleZh;
                this.ruleForm.remark = row.remark;
                this.ruleForm.id = row.id;
                this.initMenus();
                this.type = 1;
                let params = {};
                params.roleId = row.id;
                this.defaultExpandedKeys = [];
                postRequest("/access/role/getMenuIdsByRoleId", params).then(resp => {
                    if (resp) {
                        this.defaultCheckedKeys = resp.data;
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.type == 0) {
                            this.ruleForm.selectKeys = this.$refs.tree.getCheckedKeys(true);
                            postRequest("/access/role/addRoleWithMenu", this.ruleForm).then(resp => {
                                if (resp) {
                                    this.initRoles();
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }
                            })
                        } else if (this.type == 1) {
                            this.ruleForm.selectKeys = this.$refs.tree.getCheckedKeys(true);
                            postRequest("/access/role/updateRole", this.ruleForm).then(resp => {
                                if (resp) {
                                    this.initRoles();
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }
                            })
                        }
                    } else {
                        this.$message.error("请填写完整角色信息");
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.ruleForm = {};
                this.defaultCheckedKeys = [];
                this.defaultExpandedKeys = [1];
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.initRoles();
            },
            handleCurrentChange(val) {
                this.page.pageIndex = val;
                this.initRoles();
            },
            initRoles() {
                this.loading = true;
                postRequest("/access/role/getAllRoles", this.page).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.roleData = resp.data;
                        this.total = resp.total;
                    }
                })

            },
            queryRole(){
                this.loading = true;
                this.queryData.pageIndex = this.page.pageIndex;
                this.queryData.pageSize = this.page.pageSize;
                postRequest("/access/role/query", this.queryData).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.roleData = resp.data;
                        this.total = resp.total;
                        this.queryData.roleName = '';
                        this.queryData.roleZh = '';
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
