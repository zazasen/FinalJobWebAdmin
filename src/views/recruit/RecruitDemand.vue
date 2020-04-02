<!--招聘需求页面-->
<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <div class="head">
                    <div style="font-size: 25px;font-family: 华文楷体">招聘需求申请</div>
                    <div style="font-family: Arial;font-size: 12px">RECRUITMENT REQUIREMENT APPLICATION</div>
                </div>
            </div>
            <div>
                <div>
                    <div style="background-color: #EBEBEB;height: 35px;line-height: 35px">
                        <span style="margin-right: 10px;margin-left: 5px">|</span><span
                            style="font-size: 13px">需求信息</span>
                    </div>
                    <div style="margin-top: 20px">
                        <el-row>
                            <el-col :span="12">
                                <span style="margin-right: 70px;font-size: 12px">申请人</span>
                                <el-input v-model="inputForm.applyUserName" :disabled="true"
                                          style="width: 400px" size="small"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>申请部门</span>
                                <el-popover placement="right" width="500" v-model="queryVisible">
                                    <el-tree :data="depData" :props="defaultProps" @node-click="queryHandleNodeClick"
                                             :expand-on-click-node="false"
                                             style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="queryCancel">取消</el-button>
                                        <el-button type="primary" size="mini" @click="queryVisible = false">确定
                                        </el-button>
                                    </div>
                                    <el-button slot="reference" style="width: 400px" size="small">
                                        <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
                                    </el-button>
                                </el-popover>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>申请时间</span>
                                <el-date-picker v-model="inputForm.applyDate" type="datetime" value-format="timestamp"
                                                style="width: 400px" placeholder="选择日期时间" size="small">

                                </el-date-picker>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>岗位地址</span>
                                <el-input v-model="inputForm.address" style="width: 400px" size="small"></el-input>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>招聘岗位</span>
                                <el-select v-model="inputForm.positionId" clearable filterable placeholder="职位"
                                           style="width: 400px" size="small">
                                    <el-option v-for="(item,index) in positions" :key="index" :label="item.positionName"
                                               :value="item.id"/>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>到岗日期</span>
                                <el-date-picker v-model="inputForm.entryDate" type="date"
                                                style="width: 400px" size="small" placeholder="选择日期"/>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">招聘人数</span>
                                <el-input-number v-model="inputForm.needNumber"
                                                 style="width: 400px" size="small" :min="1"></el-input-number>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>招聘理由</span>
                                <el-select v-model="inputForm.reason" placeholder="请选择" style="width: 400px"
                                           size="small">
                                    <el-option
                                            v-for="item in reasons"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px;">
                            <el-col :span="24">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>岗位职责</span>
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          style="width: 1020px;margin-top: 10px"
                                          v-model="inputForm.responsibility"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                </div>

                <div style="margin-top: 50px">
                    <div style="background-color: #EBEBEB;height: 35px;line-height: 35px">
                        <span style="margin-right: 10px;margin-left: 5px">|</span><span
                            style="font-size: 13px;font-size: 12px">资格要求</span>
                    </div>
                    <div style="margin-top: 20px">
                        <el-row>
                            <el-col :span="12">
                                <span style="margin-right: 50px;font-size: 12px"><span
                                        style="color: red">*</span>最低学历</span>
                                <el-select v-model="inputForm.degree" clearable filterable placeholder="最低学历"
                                           style="width: 400px" size="small">
                                    <el-option v-for="(item,index) in topDegree" :key="index" :label="item.name"
                                               :value="item.id"/>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">年龄下限</span>
                                <el-input-number v-model="inputForm.minimumAge"
                                                 style="width: 400px" size="small" :min="1"></el-input-number>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">年龄上限</span>
                                <el-input-number v-model="inputForm.highestAge"
                                                 style="width: 400px" size="small" :min="1"></el-input-number>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">婚姻状况</span>
                                <el-select v-model="inputForm.wedlock" clearable placeholder="婚姻状况"
                                           style="width: 400px" size="small">
                                    <el-option v-for="item in wedlock" :key="item.value" :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 80px;font-size: 12px">性别</span>
                                <el-select v-model="inputForm.gender" clearable placeholder="请选择性别"
                                           style="width: 400px" size="small">
                                    <el-option v-for="item in gender" :key="item.value" :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">专业限制</span>
                                <el-input style="width: 400px" size="small" v-model="inputForm.speciality"></el-input>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">外语要求</span>
                                <el-input style="width: 400px" size="small"
                                          v-model="inputForm.foreignLanguages"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 10px;font-size: 12px">需要技能（证书）</span>
                                <el-input style="width: 400px" size="small" v-model="inputForm.skill"></el-input>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="12">
                                <span style="margin-right: 55px;font-size: 12px">工作经历</span>
                                <el-input style="width: 400px" size="small"
                                          v-model="inputForm.experience"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <span style="margin-right: 35px;font-size: 12px">试用期（月）</span>
                                <el-input-number v-model="inputForm.probationPeriod"
                                                 style="width: 400px" size="small" :min="1"></el-input-number>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div style="text-align: center">
                <el-button style="margin-right: 40px;margin-top: 20px;width: 200px" type="primary" round
                           @click="submit">提交
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "RecruitDemand",
        data() {
            return {
                inputForm: {
                    userId: '',
                    applyUserName: '',
                    departmentName: '',
                    departmentId: '',
                    applyDate: '',
                    positionId: '',
                    entryDate: '',
                    needNumber: '',
                    reason: '',
                    responsibility: '',
                    degree: '',
                    highestAge: '',
                    minimumAge: '',
                    wedlock: '',
                    gender: '',
                    speciality: '',
                    foreignLanguages: '',
                    skill: '',
                    address: '',
                    experience: '',
                    probationPeriod: '',
                },
                depData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryDepartmentName: "请选择部门",
                queryVisible: false,
                positions: [],
                gender: [{
                    value: 1,
                    label: "男"
                }, {
                    value: 0,
                    label: "女"
                }],
                reasons: [{
                    id: '1',
                    name: '辞职补充'
                }, {
                    id: '2',
                    name: '扩大编制'
                }, {
                    id: '3',
                    name: '招聘人数'
                }, {
                    id: '4',
                    name: '短期需求'
                }, {
                    id: '5',
                    name: '储备人才'
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
            }
        },
        mounted() {
            this.initDate();
            this.initDepData();
            this.initPositions();
        },
        methods: {
            submit() {
                if (!this.inputForm.departmentName) {
                    this.$message.error("请选择部门");
                    return;
                }
                if (!this.inputForm.applyDate) {
                    this.$message.error("请选择申请时间");
                    return;
                }
                if (!this.inputForm.address) {
                    this.$message.error("请输入岗位地址");
                    return;
                }
                if (!this.inputForm.positionId) {
                    this.$message.error("请选择招聘职位");
                    return;
                }
                if (!this.inputForm.entryDate) {
                    this.$message.error("请选择到岗日期");
                    return;
                }
                if (!this.inputForm.needNumber) {
                    this.$message.error("请输入招聘人数");
                    return;
                }
                if (!this.inputForm.reason) {
                    this.$message.error("请选择招聘理由");
                    return;
                }
                if (!this.inputForm.responsibility) {
                    this.$message.error("请输入岗位职责");
                    return;
                }
                if (!this.inputForm.degree) {
                    this.$message.error("请选择最低学历");
                    return;
                }
                if (this.inputForm.minimumAge <= 18) {
                    this.$message.error("年龄下限不能小于18岁");
                    return;
                }
                if (this.inputForm.highestAge <= 18) {
                    this.$message.error("年龄上限不能小于18岁");
                    return;
                }
                this.inputForm.responsibility = this.inputForm.responsibility.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
                postRequest("/recruit/demand/submitStaffNeed", this.inputForm).then(resp => {
                    if (resp) {

                    }
                })
            },
            initDate() {
                this.inputForm.userId = JSON.parse(window.sessionStorage.getItem("currentUser")).id;
                this.inputForm.applyUserName = JSON.parse(window.sessionStorage.getItem("currentUser")).realName;
                let timestamp = Date.parse(new Date());
                this.inputForm.applyDate = timestamp;
            },
            queryHandleNodeClick(data) {
                this.inputForm.departmentId = data.id;
                this.inputForm.departmentName = data.name;
                this.queryDepartmentName = data.name;
            },
            queryCancel() {
                this.queryVisible = false;
                this.queryDepartmentName = "请选择部门";
                this.inputForm.departmentId = null;
                this.inputForm.departmentName = null;
            },
            initDepData() {
                getRequest("/recruit/demand/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            initPositions() {
                getRequest("/recruit/demand/getPositions").then(resp => {
                    this.positions = resp.data;
                })
            },
        }
    }
</script>

<style scoped>
    .head {
        text-align: center;
    }
</style>
``
