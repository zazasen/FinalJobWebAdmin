<template>
    <div>
        <div>
            <el-input v-model="queryForm.name" clearable placeholder="请输入员工名" style="width: 200px"/>
            <el-popover placement="right" width="500" v-model="queryVisible">
                <el-tree :data="depData" :props="defaultProps" @node-click="queryHandleNodeClick"
                         :expand-on-click-node="false"
                         style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="queryCancel">取消</el-button>
                    <el-button type="primary" size="mini" @click="queryVisible = false">确定</el-button>
                </div>

                <el-button slot="reference" style="width: 200px;margin-left: 10px">
                    <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
                </el-button>
            </el-popover>

            <el-select v-model="queryForm.status" clearable placeholder="预备员工状态"
                       style="width: 200px;margin-left: 10px;margin-right: 10px">
                <el-option v-for="(item,index) in status" :key="index" :label="item.name"
                           :value="item.id"/>
            </el-select>
            <el-button style="margin-left: 10px" @click="initReserveStaffData">查询</el-button>
            <el-button style="margin-left: 10px" @click="showDialog" type="primary">添加</el-button>
            <el-button style="margin-left: 10px" @click="delMul" type="danger" :disabled="disabled">删除</el-button>
        </div>

        <div>
            <el-table :data="reserveStaffData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" fixed="left"/>
                <el-table-column prop="phone" label="手机号" align="center"/>
                <el-table-column prop="email" label="电子邮箱" align="center"/>
                <el-table-column prop="departmentName" label="待入职部门" align="center"/>
                <el-table-column prop="positionName" label="待入职职位" align="center"/>
                <el-table-column prop="entryTimeStr" label="入职时间" align="center"/>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="getType(scope.row)" disable-transitions>{{scope.row.statusStr}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="delOne(scope.row)" style="color: red">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="queryForm.pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="员工名称" prop="name">
                    <el-input v-model="ruleForm.name" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm.phone" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="ruleForm.email" style="width: 200px"></el-input>
                </el-form-item>

                <el-form-item label="职位" prop="positionId">
                    <el-select v-model="ruleForm.positionId" clearable filterable placeholder="职位"
                               style="width: 200px;">
                        <el-option v-for="(item,index) in positions" :key="index" :label="item.positionName"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择部门" prop="departmentId">
                    <el-popover placement="right" width="500" v-model="visible">
                        <el-tree :data="depData" :props="defaultProps" @node-click="handleNodeClick"
                                 :expand-on-click-node="false"
                                 style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="cancel">取消</el-button>
                            <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
                        </div>

                        <el-button slot="reference" style="width: 200px;">
                            <span style="color: #C0C0C0">{{departmentName}}</span>
                        </el-button>
                    </el-popover>
                </el-form-item>

                <el-form-item label="入职时间" prop="entryTime">
                    <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                                    v-model="ruleForm.entryTime" style="width: 200px;"></el-date-picker>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-select v-model="ruleForm.status" clearable placeholder="预备员工状态"
                               style="width: 200px;margin-right: 10px">
                        <el-option v-for="(item,index) in status" :key="index" :label="item.name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')" size="small">{{btn}}</el-button>
                    <el-button @click="resetForm('ruleForm')" size="small">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "HrReserveStaff",
        data() {
            return {
                loading:false,
                disabled:true,
                multipleSelection: [],
                btn: "",
                dialogVisible: false,
                title: "",
                queryForm: {
                    name: '',
                    departmentId: '',
                    status: '',
                    pageSize: 10,
                    pageIndex: 1,
                },
                total: null,
                depData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryDepartmentName: "请选择部门",
                departmentName: "请选择部门",
                queryVisible: false,
                visible: false,
                status: [{
                    id: 0,
                    name: "尚未接受 offer"
                }, {
                    id: 1,
                    name: "接受 offer 待入职"
                }, {
                    id: 2,
                    name: "拒绝 offer"
                }],
                reserveStaffData: [],
                ruleForm: {
                    name: '',
                    phone: '',
                    email: '',
                    departmentId: null,
                    positionId: '',
                    entryTime: '',
                    status: '',
                },
                positions: [],
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {
                            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                            message: '手机号格式不对',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {required: true, message: '请输入电子邮箱', trigger: 'blur'},
                        {
                            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                            message: '电子邮箱格式不对',
                            trigger: 'blur'
                        }
                    ],
                    positionId: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                    entryTime: [
                        {required: true, message: '请选择入职日期', trigger: 'blur'},
                    ],
                    status: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                    departmentId: [
                        {required: true, message: '请选择部门', trigger: 'change'},
                    ],
                }
            }
        },
        mounted() {
            this.initDepData();
            this.initReserveStaffData();
            this.initPositions();
        },
        methods: {
            delOne(row) {
                this.$confirm('此操作将删除 <span style="color:red">' + row.name + '</span> 员工,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    let params = {};
                    params.id = row.id;
                    postRequest("/hr/reserveStaff/delReserveStaff", params).then(resp => {
                        if (resp) {
                            this.initReserveStaffData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            delMul(){
                this.$confirm('此操作将删除选中员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {};
                    params.ids = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        params.ids[i] = this.multipleSelection[i].id;
                    }
                    postRequest("/hr/reserveStaff/delReserveStaffs", params).then(resp => {
                        if (resp) {
                            this.initReserveStaffData();
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
                    this.disabled = false;
                    this.multipleSelection = val;
                } else {
                    this.disabled = true;
                }
            },
            edit(row) {
                this.title = "修改预备员工";
                this.btn = "更新";
                let temp = Object.assign({}, row);
                this.ruleForm = temp;
                this.departmentName = this.ruleForm.departmentName;
                this.dialogVisible = true;
            },
            initPositions() {
                getRequest("/hr/staff/getPositions").then(resp => {
                    this.positions = resp.data;
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.btn == '添加') {
                            postRequest("/hr/reserveStaff/addReserveStaff", this.ruleForm).then(resp => {
                                if (resp) {
                                    this.initReserveStaffData();
                                    this.addForm = {};
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }
                            });
                        } else {
                            postRequest("/hr/reserveStaff/updateReserveStaff", this.ruleForm).then(resp => {
                                if (resp) {
                                    this.initReserveStaffData();
                                    this.addForm = {};
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.ruleForm = {};
                this.$refs[formName].resetFields();
                this.departmentName = '请选择部门';
                this.dialogVisible = false;
            },
            showDialog() {
                this.title = "添加预备员工";
                this.btn = "添加";
                this.dialogVisible = true;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                        this.$refs['ruleForm'].resetFields();
                        this.ruleForm = {};
                        this.departmentName = '请选择部门';
                    })
                    .catch(_ => {
                    });
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initReserveStaffData();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initReserveStaffData();
            },
            getType(row) {
                if (row.status == 0) {
                    return 'primary';
                }
                if (row.status == 1) {
                    return 'success';
                }
                if (row.status == 2) {
                    return 'danger';
                }
            },
            handleNodeClick(data) {
                this.ruleForm.departmentId = data.id;
                this.departmentName = data.name;
            },
            cancel() {
                this.visible = false;
                this.departmentName = "请选择部门";
                this.ruleForm.departmentId = null;
            },
            queryHandleNodeClick(data) {
                this.queryForm.departmentId = data.id;
                this.queryDepartmentName = data.name;
            },
            queryCancel() {
                this.queryVisible = false;
                this.queryDepartmentName = "请选择部门";
                this.queryForm.departmentId = null;
            },
            initDepData() {
                getRequest("/hr/reserveStaff/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            initReserveStaffData() {
                this.loading = true;
                postRequest("/hr/reserveStaff/getAllReserveStaff", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.reserveStaffData = resp.data;
                        this.total = resp.total;
                    } else {
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
