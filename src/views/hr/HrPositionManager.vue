<template>
    <div>
        <div>
            <el-input placeholder="请输入职位名" style="width: 250px;margin-right: 10px"
                      v-model="queryFrom.positionName" :clearable="true" @keydown.enter.native="queryPosition"/>
            <el-select v-model="queryFrom.positionLevel" placeholder="请选择职位等级"
                       style="width: 250px;margin-right: 10px" :clearable="true">
                <el-option v-for="(item,index) in positionLevelOptions" :key="index"
                           :label="item.level" :value="item.code"/>
            </el-select>
            <el-button @click="queryPosition">查询</el-button>
            <el-button type="success" @click="dialogVisible = true">添加</el-button>
            <el-button type="danger" :disabled="disabled" @click="mulDel">删除</el-button>
        </div>
        <div>
            <el-table :data="positionDate" border stripe style="width: 100%;margin-top: 10px"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      @selection-change="positionHandleSelectionChange"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column prop="id" label="id" width="100" align="center"/>
                <el-table-column prop="positionName" label="职位" width="250" align="center"/>
                <el-table-column prop="positionLevelStr" label="职位级别" width="150" align="center"/>
                <el-table-column prop="createTime" label="创建时间" align="center"/>
                <el-table-column prop="enabledStr" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enabled === 1 ? 'success' : 'danger'">
                            {{scope.row.enabledStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center"/>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="positionHandleClick(scope.row)" type="text">修改</el-button>
                        <el-button type="text" style="color: red" @click="positionHandleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;margin-top: 10px">
                <el-pagination
                        @size-change="positionHandleSizeChange"
                        @current-change="positionHandleCurrentChange"
                        :page-sizes="[5, 8, 10, 20]"
                        :page-size="queryFrom.pageSize"
                        layout="sizes, prev, pager, next, jumper, ->, total"
                        :total=total>
                </el-pagination>
            </div>
        </div>

        <el-dialog title="添加职位" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-form :model="positionForm" :rules="rules" ref="positionForm" label-width="100px">
                <el-form-item label="职位" prop="positionName" style="width: 80%">
                    <el-input v-model="positionForm.positionName" placeholder="请输入职位名"/>
                </el-form-item>
                <el-form-item label="级别" prop="positionLevel" style="width: 80%">
                    <el-select v-model="positionForm.positionLevel" placeholder="请选择职位等级" style="width: 100%">
                        <el-option v-for="(item,index) in positionLevelOptions" :key="index" :label="item.level"
                                   :value="item.code"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" style="width: 80%">
                    <el-input v-model="positionForm.remark" placeholder="请输入职位"
                              @keydown.enter.native="submitPositionForm('positionForm')"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPositionForm('positionForm')">取 消</el-button>
                <el-button type="primary" @click="submitPositionForm('positionForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改职位" :visible.sync="updateDialogVisible" width="40%" :before-close="handleClose">
            <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px">
                <el-form-item label="职位" prop="positionName" style="width: 80%">
                    <el-input v-model="updateForm.positionName" placeholder="请输入职位名"/>
                </el-form-item>
                <el-form-item label="级别" prop="positionLevel" style="width: 80%">
                    <el-select v-model="updateForm.positionLevel" placeholder="请选择职位等级" style="width: 100%">
                        <el-option v-for="(item,index) in positionLevelOptions" :key="index" :label="item.level"
                                   :value="item.code"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" style="width: 80%">
                    <el-input v-model="updateForm.remark" placeholder="请输入职位"
                              @keydown.enter.native="submitUpdatePositionForm('updateForm')"/>
                </el-form-item>
                <el-form-item label="状态" style="width: 80%">
                    <el-switch v-model="updateForm.enabled" active-text="启用" inactive-text="禁用"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetUpdatePositionForm('updateForm')">取 消</el-button>
                <el-button type="primary" @click="submitUpdatePositionForm('updateForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "HrPositionManager",
        data() {
            return {
                positionLevelOptions: {},
                disabled: true,
                queryFrom: {
                    positionLevel: null,
                    positionName: '',
                    pageSize: 5,
                    pageIndex: 1,
                },
                positionForm: {
                    positionLevel: null,
                    positionName: '',
                    remark: ''
                },
                updateForm: {
                    id: null,
                    positionLevel: null,
                    positionName: '',
                    remark: '',
                    enabled: null
                },
                positionDate: null,
                total: null,
                loading: false,
                dialogVisible: false,
                updateDialogVisible: false,
                rules: {
                    positionName: [
                        {required: true, message: '请输入职位名称', trigger: 'blur'},
                    ],
                    positionLevel: [
                        {required: true, message: '请选择职位等级', trigger: 'blur'},
                    ],
                },
                multipleSelection: [],
            }
        },
        mounted() {
            this.initLevel();
            this.initPositionData();
        },
        methods: {
            mulDel() {
                this.$confirm('此操作将删除该职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {};
                    params.ids = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        params.ids[i] = this.multipleSelection[i].id;
                    }
                    postRequest("/hr/position/delPositionsByIds", params).then(resp => {
                        if (resp) {
                            this.initPositionData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            queryPosition() {
                this.initPositionData();
            },
            handleClose() {
                this.dialogVisible = false;
                this.updateDialogVisible = false;
                this.positionForm = {};
                this.updateForm = {};
            },
            submitPositionForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        postRequest("/hr/position/addPosition", this.positionForm).then(resp => {
                            if (resp) {
                                this.initPositionData();
                                this.dialogVisible = false;
                                this.positionForm = {};
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            submitUpdatePositionForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        postRequest("/hr/position/updatePosition", this.updateForm).then(resp => {
                            if (resp) {
                                this.initPositionData();
                                this.updateDialogVisible = false;
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetPositionForm(formName) {
                this.$refs[formName].resetFields();
                this.positionForm = {};
                this.dialogVisible = false;
            },
            resetUpdatePositionForm(formName) {
                this.$refs[formName].resetFields();
                this.updateForm = {};
                this.updateDialogVisible = false;
            },
            positionHandleClick(row) {
                Object.assign(this.updateForm, row);
                let flag = this.updateForm.enabled == 1 ? true : false;
                this.updateForm.enabled = flag;
                this.updateDialogVisible = true;
            },
            positionHandleDelete(row) {
                this.$confirm('此操作将删除 <span style="color:red">' + row.positionLevelStr + "" + row.positionName + '</span> 职位,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    let params = {};
                    params.id = row.id;
                    postRequest("/hr/position/delPosition", params).then(resp => {
                        if (resp) {
                            this.initPositionData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            positionHandleSelectionChange(val) {
                if (val.length > 0) {
                    this.multipleSelection = val;
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            },
            positionHandleSizeChange(val) {
                this.queryFrom.pageSize = val;
                this.initPositionData();
            },
            positionHandleCurrentChange(val) {
                this.queryFrom.pageIndex = val;
                this.initPositionData();
            },
            initLevel() {
                getRequest("/hr/position/getLevel").then(resp => {
                    if (resp) {
                        this.positionLevelOptions = resp.data;
                    }
                })
            },
            initPositionData() {
                this.loading = true;
                postRequest("/hr/position/getPosition", this.queryFrom).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.positionDate = resp.data;
                        this.total = resp.total;
                    }
                })
            }
        }
    }
</script>

<style>

</style>
