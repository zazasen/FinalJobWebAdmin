<template>
    <div>
        <div>
            <el-card>
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input v-model="queryForm.realName" clearable placeholder="请输入员工名" size="mini"/>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="queryForm.gender" clearable placeholder="请选择性别" size="mini">
                            <el-option v-for="item in gender" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="queryForm.wedlock" clearable placeholder="婚姻状况" size="mini">
                            <el-option v-for="item in wedlock" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="queryForm.nationId" filterable clearable placeholder="民族" size="mini">
                            <el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-cascader clearable filterable v-model="queryForm.nativePlaceArr" :options="options"
                                     placeholder="请选择籍贯" size="mini"></el-cascader>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="queryForm.phone" clearable placeholder="电话号码" size="mini"/>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px">
                    <el-col :span="4">
                        <el-popover placement="right" width="500" v-model="queryVisible">
                            <el-tree :data="depData" :props="defaultProps" @node-click="queryHandleNodeClick"
                                     :expand-on-click-node="false"
                                     style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="queryCancel">取消</el-button>
                                <el-button type="primary" size="mini" @click="queryVisible = false">确定</el-button>
                            </div>
                            <el-button slot="reference" style="width: 100%" size="mini">
                                <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
                            </el-button>
                        </el-popover>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="queryForm.positionId" clearable filterable placeholder="职位" size="mini">
                            <el-option v-for="(item,index) in positions" :key="index" :label="item.positionName"
                                       :value="item.id"/>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="queryForm.topDegree" clearable filterable placeholder="最高学历" size="mini">
                            <el-option v-for="(item,index) in topDegree" :key="index" :label="item.name"
                                       :value="item.id"/>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="queryForm.workState" clearable placeholder="在职状态" size="mini">
                            <el-option v-for="(item,index) in workState" :key="index" :label="item.name"
                                       :value="item.id"/>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="queryForm.workId" clearable placeholder="请输入工号" style="width: 50%"
                                  size="mini"/>
                    </el-col>
                </el-row>
                <el-row  style="margin-top: 10px">
                    <el-col :span="8">
                        <div>
                            <span style="font-size: 14px">入职日期</span>
                            <el-date-picker v-model="createTime" type="daterange" range-separator="至"
                                            start-placeholder="开始日期" end-placeholder="结束日期" size="mini"
                                            style="margin-left: 5px" @change="createTimeChange"
                                            value-format="timestamp">
                            </el-date-picker>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <span style="font-size: 14px">离职日期</span>
                            <el-date-picker v-model="departureTime" type="daterange" range-separator="至"
                                            start-placeholder="开始日期" end-placeholder="结束日期" size="mini"
                                            style="margin-left: 5px" @change="departureTimeChange"
                                            value-format="timestamp">
                            </el-date-picker>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <el-button size="mini" @click="queryStaffDate">搜索</el-button>
                        <el-button size="mini" type="success" @click="addButton">新增</el-button>
                        <el-button size="mini" type="danger" :disabled="mulDelTemp" @click="mulDel">删除</el-button>

                        <el-upload style="display: inline-flex;margin-right: 10px;margin-left: 10px" action="/hr/staff/importStaff"
                                :show-file-list="false"
                                :before-upload="beforeUpload"
                                :on-success="onSuccess"
                                :on-error="onError"
                                :disabled="importDisabled">
                            <el-button size="mini" type="primary" icon="el-icon-upload2">{{importName}}</el-button>
                        </el-upload>
                        <el-button size="mini" type="primary" icon="el-icon-download" @click="exportStaffDate">导出</el-button>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div>
            <el-table :data="queryData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="55" align="center"/>
                <el-table-column fixed="left" prop="realName" label="员工姓名" width="100" align="center"/>
                <el-table-column prop="workId" label="工号" width="100" align="center"/>
                <el-table-column prop="genderStr" label="性别" width="100" align="center"/>
                <el-table-column prop="birthday" label="出生日期" width="150" align="center"/>
                <el-table-column prop="idCard" label="身份证号" width="150" align="center"/>
                <el-table-column prop="wedlockStr" label="婚姻状况" width="100" align="center"/>
                <el-table-column prop="nationName" label="民族" width="100" align="center"/>
                <el-table-column prop="nativePlace" label="籍贯" width="200" align="center"/>
                <el-table-column prop="politicsStr" label="政治面貌" width="120" align="center"/>
                <el-table-column prop="email" label="邮箱" width="150" align="center"/>
                <el-table-column prop="phone" label="电话号码" width="120" align="center"/>
                <el-table-column prop="address" label="联系地址" width="200" align="center"/>
                <el-table-column prop="departmentName" label="部门" width="150" align="center"/>
                <el-table-column prop="positionName" label="职位" width="150" align="center"/>
                <el-table-column prop="positionLevelName" label="职位级别" width="150" align="center"/>
                <el-table-column prop="topDegreeStr" label="最高学历" width="100" align="center"/>
                <el-table-column prop="specialty" label="所属专业" width="150" align="center"/>
                <el-table-column prop="school" label="毕业院校" width="150" align="center"/>
                <el-table-column prop="workStateStr" label="在职状态" width="100" align="center"/>
                <el-table-column prop="contractTermStr" label="合同期限" width="100" align="center"/>
                <el-table-column prop="workAgeStr" label="工龄" width="100" align="center"/>
                <el-table-column prop="createTime" label="入职时间" width="150" align="center"/>
                <el-table-column prop="conversionTime" label="转正日期" width="150" align="center"/>
                <el-table-column prop="departureTime" label="离职日期" width="150" align="center"/>
                <el-table-column prop="beginContractTime" label="合同起始日期" width="150" align="center"/>
                <el-table-column prop="endContractTime" label="合同终止日期" width="150" align="center"/>
                <el-table-column prop="enabledStr" label="账号状态" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enabled === true ? 'success' : 'danger'">{{scope.row.enabledStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" style="color: red" size="small" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="staffHandleSizeChange"
                           @current-change="staffHandleCurrentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>
        <el-dialog :title="diaType" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="登录账号" prop="username" size="small">
                            <el-input v-model="addForm.username" placeholder="请输入登录账号" :disabled="diaType == '修改'"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="员工姓名" prop="realName" size="small">
                            <el-input v-model="addForm.realName" placeholder="请输入员工姓名"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="性别" prop="gender" size="small">
                            <el-select v-model="addForm.gender" clearable placeholder="请选择性别">
                                <el-option v-for="item in gender" :key="item.value" :label="item.label"
                                           :value="item.value"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="身份证号" prop="idCard" size="small">
                            <el-input v-model="addForm.idCard" placeholder="请输入身份证号"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="婚姻状况" prop="wedlock" size="small">
                            <el-select v-model="addForm.wedlock" clearable placeholder="婚姻状况">
                                <el-option v-for="item in wedlock" :key="item.value" :label="item.label"
                                           :value="item.value"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="民族" prop="nationId" size="small">
                            <el-select v-model="addForm.nationId" filterable clearable placeholder="民族" size="small">
                                <el-option v-for="item in nations" :key="item.id" :label="item.name"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="籍贯" prop="nativePlaceArr" size="small">
                            <el-cascader clearable filterable v-model="addForm.nativePlaceArr" :options="options"
                                         placeholder="请选择籍贯"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="政治面貌" prop="politicsId" size="small">
                            <el-select v-model="addForm.politicsId" filterable clearable placeholder="政治面貌">
                                <el-option v-for="item in politicsStatus" :key="item.id" :label="item.name"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="邮箱" prop="email" size="small">
                            <el-input v-model="addForm.email" placeholder="请输入邮箱"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号码" prop="phone" size="small">
                            <el-input v-model="addForm.phone" placeholder="请输入手机号码"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系地址" prop="address" size="small">
                            <el-input v-model="addForm.address" placeholder="请输入联系地址"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="请选择部门" prop="departmentId" size="small">
                            <el-popover placement="right" width="500" v-model="addVisible">
                                <el-tree :data="depData" :props="defaultProps" @node-click="addHandleNodeClick"
                                         :expand-on-click-node="false"
                                         style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                                <div style="text-align: right; margin: 0">
                                    <el-button type="text" @click="addCancel">取消</el-button>
                                    <el-button type="primary" @click="addVisible = false">确定</el-button>
                                </div>
                                <el-button slot="reference" style="width: 100%">
                                    <span style="color: #C0C0C0">{{addDepartmentName}}</span>
                                </el-button>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="职位" prop="positionId" size="small">
                            <el-select v-model="addForm.positionId" clearable filterable placeholder="职位">
                                <el-option v-for="(item,index) in positions" :key="index" :label="item.positionName"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="学历" prop="topDegree" size="small">
                            <el-select v-model="addForm.topDegree" clearable filterable placeholder="最高学历">
                                <el-option v-for="(item,index) in topDegree" :key="index" :label="item.name"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属专业" prop="specialty" size="small">
                            <el-input v-model="addForm.specialty" placeholder="所属专业"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="毕业学校" prop="school" size="small">
                            <el-input v-model="addForm.school" placeholder="毕业学校"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="工龄" prop="workAge" size="small">
                            <el-input-number v-model="addForm.workAge" :precision="1" :step="0.1" :min="0"
                                             style="width: 100%;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出生日期" prop="birthday" size="small">
                            <el-date-picker v-model="addForm.birthday" type="date" style="width: 100%"
                                            placeholder="选择日期" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="diaType == '修改'">
                        <el-form-item label="账号状态" prop="enabled" size="small">
                            <el-switch v-model="addForm.enabled" active-text="启用" inactive-text="禁用"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {postRequest, getRequest} from "../../utils/RequestUtil";
    import options from "../../utils/country-level3-data";

    export default {
        name: "HrStaffManager",
        data() {
            return {
                importDisabled:false,
                importName:"导入",
                mulDelTemp: true,
                diaType: "添加",
                loading: false,
                dialogVisible: false,
                queryVisible: false,
                addVisible: false,
                depData: [],
                queryData: null,
                createTime: [],
                departureTime: [],
                politicsStatus: [],
                queryForm: {
                    realName: "",
                    gender: null,
                    wedlock: null,
                    nationId: null,
                    nativePlaceArr: [],
                    phone: "",
                    departmentId: null,
                    positionId: null,
                    topDegree: null,
                    workState: null,
                    workId: "",
                    createTimeStart: null,
                    createTimeEnd: null,
                    departureTimeStart: null,
                    departureTimeEnd: null,
                },
                addForm: {
                    id: null,
                    username: 'chenzengsen',
                    realName: '陈增森',
                    gender: 1,
                    idCard: "350525199711045615",
                    wedlock: 1,
                    nationId: 1,
                    nativePlaceArr: [],
                    nativePlace: "",
                    politicsId: 1,
                    email: '1355442185@qq.com',
                    phone: "18815978332",
                    address: "福建",
                    departmentId: 1,
                    positionId: 1,
                    topDegree: 1,
                    specialty: "计算机",
                    school: "福建工程学院",
                    workAge: 1.5,
                    birthday: "",
                    enabled: "",
                },
                queryDepartmentName: "请选择部门",
                addDepartmentName: "请选择部门",
                options: options,
                gender: [{
                    value: 1,
                    label: "男"
                }, {
                    value: 0,
                    label: "女"
                }],
                wedlock: [{
                    value: 0,
                    label: "已婚"
                }, {
                    value: 1,
                    label: "未婚"
                }, {
                    value: 2,
                    label: "离异"
                }],
                topDegree: [{
                    id: 0,
                    name: "其他"
                }, {
                    id: 1,
                    name: "小学"
                }, {
                    id: 2,
                    name: "初中"
                }, {
                    id: 3,
                    name: "高中"
                }, {
                    id: 4,
                    name: "大专"
                }, {
                    id: 5,
                    name: "本科"
                }, {
                    id: 6,
                    name: "硕士"
                }, {
                    id: 7,
                    name: "博士"
                }],
                workState: [{
                    id: 1,
                    name: "在职"
                }, {
                    id: 0,
                    name: "离职"
                }],
                nations: [],
                positions: [],
                pageIndex: 1,
                pageSize: 10,
                total: null,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rules: {
                    username: [
                        {required: true, message: '请输入登录账号', trigger: 'blur'},
                    ],
                    realName: [
                        {required: true, message: '请输入员工姓名', trigger: 'blur'},
                    ],
                    gender: [
                        {required: true, message: '请输入员工性别', trigger: 'change'},
                    ],
                    idCard: [
                        {required: true, message: '请输入员工身份证号', trigger: 'blur'},
                        {
                            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                            message: '身份证号码格式有误',
                            trigger: 'blur'
                        }
                    ],
                    wedlock: [
                        {required: true, message: '请选择员工婚姻状况', trigger: 'change'},
                    ],
                    nationId: [
                        {required: true, message: '请选择员工所属民族', trigger: 'change'},
                    ],
                    nativePlaceArr: [
                        {required: true, message: '请选择籍贯', trigger: 'change'},
                    ],
                    politicsId: [
                        {required: true, message: '请选择籍贯', trigger: 'change'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {
                            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                            message: '手机号格式不对',
                            trigger: 'blur'
                        }
                    ],
                    address: [
                        {required: true, message: '请输入联系地址', trigger: 'blur'},
                    ],
                    departmentId: [
                        {required: true, message: '请选择部门', trigger: 'change'},
                    ],
                    positionId: [
                        {required: true, message: '请选择职位', trigger: 'change'},
                    ],
                    topDegree: [
                        {required: true, message: '请选择学历', trigger: 'change'},
                    ],
                    specialty: [
                        {required: true, message: '请输入所属专业', trigger: 'blur'},
                    ],
                    school: [
                        {required: true, message: '请输入毕业学校', trigger: 'blur'},
                    ],
                    workAge: [
                        {required: true, message: '请输入工龄', trigger: 'blur'},
                    ],
                    birthday: [
                        {required: true, message: '请选择出生日期', trigger: 'blur'},
                    ],
                },
                multipleSelection: [],
            }
        },
        mounted() {
            this.initUserData();
            this.initNations();
            this.initDepData();
            this.initPositions();
            this.initPoliticsStatus();
        },
        methods: {
            onError(response) {
                this.$message.error(response.msg);
                this.importName = '导入';
                this.importDisabled = false;
            },
            onSuccess(response) {
                this.$message.success(response.msg);
                this.initUserData();
                this.importName = '导入';
                this.importDisabled = false;
            },
            beforeUpload() {
                this.importDisabled = true;
                this.importName = "正在导入";
            },
            exportStaffDate(){
                window.open("/hr/staff/exportStaff", "_parent");
            },
            mulDel() {
                this.$confirm('此操作将删除该员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {};
                    params.ids = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        params.ids[i] = this.multipleSelection[i].id;
                    }
                    postRequest("/hr/staff/delStaffs", params).then(resp => {
                        if (resp) {
                            this.initUserData();
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
                    this.mulDelTemp = false;
                    this.multipleSelection = val;
                } else {
                    this.mulDelTemp = true;
                }
            },
            addButton() {
                this.diaType = "添加";
                this.dialogVisible = true;
            },
            handleEdit(row) {
                this.diaType = "修改";
                this.dialogVisible = true;
                let temp = Object.assign({}, row);
                this.addForm = temp;
                this.addDepartmentName = row.departmentName;
                this.addForm.nativePlaceArr = this.addForm.nativePlace.split(" ");
            },
            handleDelete(row) {
                this.$confirm('此操作将删除 <span style="color:red">' + row.realName + '</span> 员工,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    let param = {};
                    param.id = row.id;
                    postRequest("/hr/staff/delStaff", param).then(resp => {
                        if (resp) {
                            this.initUserData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            staffHandleSizeChange(val) {
                this.pageSize = val;
                this.initUserData();
            },
            staffHandleCurrentChange(val) {
                this.pageIndex = val;
                this.initUserData();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let temp = "";
                        for (let i = 0; i < this.addForm.nativePlaceArr.length; i++) {
                            temp = temp + this.addForm.nativePlaceArr[i] + " ";
                        }
                        temp = temp.substring(0, temp.length - 1);
                        this.addForm.nativePlace = temp;
                        if (this.diaType == "添加") {
                            postRequest("/hr/staff/addStaff", this.addForm).then(resp => {
                                if (resp) {
                                    this.initUserData();
                                    this.addForm.nativePlace = "";
                                    this.addForm = {};
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }
                            });
                        } else {
                            postRequest("/hr/staff/updateStaff", this.addForm).then(resp => {
                                if (resp) {
                                    this.initUserData();
                                    this.addForm.nativePlace = "";
                                    this.addForm = {};
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.addForm.nativePlace = "";
                this.addForm = {};
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
            },
            handleClose() {
                this.dialogVisible = false;
                this.addForm.nativePlace = "";
                this.$refs['addForm'].resetFields();
                this.addForm = {};
            },
            queryStaffDate() {
                if (this.createTime == null || this.createTime.length <= 0) {
                    this.queryForm.createTimeStart = null;
                    this.queryForm.createTimeEnd = null;
                }
                if (this.departureTime == null || this.departureTime.length <= 0) {
                    this.queryForm.departureTimeStart = null;
                    this.queryForm.departureTimeEnd = null;
                }
                if (this.queryForm.nativePlaceArr && this.queryForm.nativePlaceArr.length > 0) {
                    let temp = "";
                    for (let i = 0; i < this.queryForm.nativePlaceArr.length; i++) {
                        temp = temp + this.queryForm.nativePlaceArr[i] + " ";
                    }
                    temp = temp.substring(0, temp.length - 1);
                    this.queryForm.nativePlace = temp;
                } else {
                    this.queryForm.nativePlace = null;
                }
                this.initUserData();
            },
            createTimeChange() {
                this.queryForm.createTimeStart = this.createTime[0];
                this.queryForm.createTimeEnd = this.createTime[1];
            },
            departureTimeChange() {
                this.queryForm.departureTimeStart = this.departureTime[0];
                this.queryForm.departureTimeEnd = this.departureTime[1];
            },
            queryCancel() {
                this.queryVisible = false;
                this.queryDepartmentName = "请选择部门";
                this.queryForm.departmentId = null;

            },
            addCancel() {
                this.addVisible = false;
                this.addDepartmentName = "请选择部门";
                this.addForm.departmentId = null;

            },
            queryHandleNodeClick(data) {
                this.queryForm.departmentId = data.id;
                this.queryDepartmentName = data.name;
            },
            addHandleNodeClick(data) {
                this.addForm.departmentId = data.id;
                this.addDepartmentName = data.name;
            },
            initUserData() {
                this.loading = true;
                this.queryForm.pageIndex = this.pageIndex;
                this.queryForm.pageSize = this.pageSize;
                postRequest("/hr/staff/getStaff", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.queryData = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            initNations() {
                getRequest("/hr/staff/getNations").then(resp => {
                    this.nations = resp.data;
                })
            },
            initDepData() {
                getRequest("/hr/department/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            initPositions() {
                getRequest("/hr/staff/getPositions").then(resp => {
                    this.positions = resp.data;
                })
            },
            initPoliticsStatus() {
                getRequest("/hr/staff/getPoliticsStatus").then(resp => {
                    this.politicsStatus = resp.data;
                })
            }
        }
    }
</script>

<style>

</style>
