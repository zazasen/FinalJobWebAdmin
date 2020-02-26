<template>
    <div style="margin-left: 10px;margin-top: 10px">
        <div>
            <el-button type="success" icon="el-icon-plus" @click="addDialogVisible = true">增加</el-button>
        </div>
        <div>
            <el-table :data="depData" border stripe style="width: 80%;margin-top: 10px"
                      :default-expand-all="true"
                      row-key="id" :expand-row-keys="['1']"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="name" label="部门名"/>
                <el-table-column prop="parentName" label="上级部门" width="250" align="center"/>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text">修改</el-button>
                        <el-button type="text" style="color: red" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :destroy-on-close="true">
            <label><span style="color: red;margin-right: 5px">*</span>部门名称</label>
            <el-input style="width: 250px;margin-left: 10px" v-model="depFormDate.name" placeholder="请输入部门名"/>
            <br>
            <label><span style="margin-right: 5px"></span>上级部门</label>
            <el-input style="width: 250px;margin-left: 15px;margin-top: 10px" disabled
                      v-model="depFormDate.parentName"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdate">取 消</el-button>
                <el-button type="primary" @click="updateDep">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加部门" :visible.sync="addDialogVisible" width="30%" :destroy-on-close="true">
            <label><span style="color: red;margin-right: 5px">*</span>部门名称</label>
            <el-input style="width: 250px;margin-left: 10px" v-model="depFormDate.name" placeholder="请输入部门名"/>
            <div style="margin-top: 10px;display: flex;justify-content: flex-start">
                <label><span style="color: red;margin-right: 5px">*</span>上级部门</label>
                <el-tree :data="depData" :props="defaultProps" @node-click="handleNodeClick"
                         :expand-on-click-node="false"
                         style="margin-left: 10px" :highlight-current="true"></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addDep">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "HrDepManager",
        data() {
            return {
                depData: [],
                loading: false,
                dialogVisible: false,
                addDialogVisible: false,
                depFormDate: {
                    id: null,
                    name: null,
                    parentId: null,
                    parentName: null
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initDepData();
        },
        methods: {
            handleNodeClick(data) {
                this.depFormDate.parentId = data.id;
                this.depFormDate.parentName = data.name;
            },
            addDep() {
                if (this.depFormDate.name && this.depFormDate.parentName) {
                    postRequest("/hr/department/addDep", this.depFormDate).then(resp => {
                        if (resp) {
                            this.initDepData();
                            this.depFormDate = {};
                        }
                    });
                    this.addDialogVisible = false;
                } else if (this.depFormDate.name) {
                    this.$message.warning("请选择上级部门")
                } else {
                    this.$message.warning("请输入部门名")
                }
            },
            cancel() {
                this.addDialogVisible = false;
                this.depFormDate = {};
            },
            initDepData() {
                this.loading = true;
                getRequest("/hr/department/getAllDepartment").then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.depData = resp.data;
                    }
                })
            },
            handleDelete(row) {
                this.$confirm('此操作将删除 <span style="color:red">' + row.name + '</span> 部门,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.depFormDate.id = row.id;
                    this.depFormDate.parentId = row.parentId;
                    postRequest("/hr/department/delDep", this.depFormDate).then(resp => {
                        if (resp) {
                            this.initDepData();
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
                this.depFormDate.id = row.id;
                this.depFormDate.name = row.name;
                this.depFormDate.parentName = row.parentName;
                this.dialogVisible = true;
            },
            updateDep() {
                if (this.depFormDate.name) {
                    postRequest("/hr/department/updateDep", this.depFormDate).then(resp => {
                        if (resp) {
                            this.initDepData();
                            this.dialogVisible = false;
                        }
                    })
                } else {
                    this.$message.warning("请输入部门名");
                }
            },
            cancelUpdate() {
                this.depFormDate = {};
                this.dialogVisible = false;
            },
        }
    }
</script>

<style>

</style>
