<template>
    <div>
        <div style="text-align: center">
            <el-button @click="leaveApply" type="info" style="border-radius: 0px;width: 100px">请假</el-button>
        </div>
        <div style="margin-top: 50px">
            <el-row :gutter="50" style="margin-left: 50px">
                <el-col :span="7">
                    <el-card shadow="never"
                             v-loading="exchangeLoading"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(0, 0, 0, 0.8)">
                        <div slot="header">
                            <span>{{exchange.createTime}} 年调休</span>
                        </div>
                        <div>
                            <div><span>总共可调 {{exchange.holidayTime}} 天</span></div>
                            <div><span>剩余可调 {{exchange.remaining}} 天</span></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card shadow="never"
                             v-loading="sickLeaveLoading"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(0, 0, 0, 0.8)">
                        <div slot="header">
                            <span>{{sickLeave.createTime}} 年病假</span>
                        </div>
                        <div>
                            <div><span>总共可请 {{sickLeave.holidayTime}} 天</span></div>
                            <div><span>剩余可请 {{sickLeave.remaining}} 天</span></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card shadow="never"
                             v-loading="annualLeaveLoading"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(0, 0, 0, 0.8)">
                        <div slot="header">
                            <span>{{annualLeave.createTime}} 年年假</span>
                        </div>
                        <div>
                            <div><span>总共可请 {{annualLeave.holidayTime}} 天</span></div>
                            <div><span>剩余可请 {{annualLeave.remaining}} 天</span></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="50" style="margin-left: 50px;margin-top: 50px">
                <el-col :span="7">
                    <el-card shadow="never"
                             v-loading="breastfeedingLeaveLoading"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(0, 0, 0, 0.8)">
                        <div slot="header">
                            <span>{{breastfeedingLeave.createTime}} 年哺乳假</span>
                        </div>
                        <div>
                            <div><span>总共可请 {{breastfeedingLeave.holidayTime}} 天</span></div>
                            <div><span>剩余可请 {{breastfeedingLeave.remaining}} 天</span></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card shadow="never"
                             v-loading="marriageHolidayLoading"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(0, 0, 0, 0.8)">
                        <div slot="header">
                            <span>{{marriageHoliday.createTime}} 年婚假</span>
                        </div>
                        <div>
                            <div><span>总共可请 {{marriageHoliday.holidayTime}} 天</span></div>
                            <div><span>剩余可请 {{marriageHoliday.remaining}} 天</span></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card shadow="never"
                             v-loading="funeralLeaveLoading"
                             element-loading-text="拼命加载中"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(0, 0, 0, 0.8)">
                        <div slot="header">
                            <span>{{funeralLeave.createTime}} 年丧假</span>
                        </div>
                        <div>
                            <div><span>总共可请 {{funeralLeave.holidayTime}} 天</span></div>
                            <div><span>剩余可请 {{funeralLeave.remaining}} 天</span></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="申请单填写" :visible.sync="dialogVisible" width="40%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="假期类型" prop="holidayType">
                    <el-select v-model="ruleForm.holidayType" placeholder="请选择假期类型" style="width: 350px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="假期类型" prop="dateRange">
                    <el-date-picker v-model="ruleForm.dateRange" type="daterange" range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="timestamp" style="width: 350px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="请假理由" prop="reason">
                    <el-input type="textarea" v-model="ruleForm.reason" style="width: 350px"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "StaffMyHoliday",
        data() {
            return {
                options: [{
                    value: '0',
                    label: '调休'
                }, {
                    value: '1',
                    label: '病假'
                }, {
                    value: '2',
                    label: '年假'
                }, {
                    value: '3',
                    label: '哺乳假'
                }, {
                    value: '4',
                    label: '婚假'
                }, {
                    value: '5',
                    label: '丧假'
                }],
                ruleForm: {
                    holidayType: null,
                    dateRange: [],
                    reason: null,
                    beginTime: null,
                    endTime: null,
                },
                rules: {
                    holidayType: [
                        {required: true, message: '请选择假期类型', trigger: 'change'}
                    ],
                    dateRange: [
                        {required: true, message: '请选择请假时间范围', trigger: 'blur'}
                    ],
                    reason: [
                        {required: true, message: '请填写请假原因', trigger: 'blur'}
                    ]
                },
                dialogVisible: false,
                // 调休
                exchange: {},
                // 病假
                sickLeave: {},
                // 年假
                annualLeave: {},
                // 哺乳假
                breastfeedingLeave: {},
                // 婚假
                marriageHoliday: {},
                // 丧假
                funeralLeave: {},
                exchangeLoading: false,
                sickLeaveLoading: false,
                annualLeaveLoading: false,
                funeralLeaveLoading: false,
                breastfeedingLeaveLoading: false,
                marriageHolidayLoading: false,
            }
        },
        mounted() {
            this.initExchange();
            this.initSickLeave();
            this.initAnnualLeave();
            this.initBreastfeedingLeave();
            this.initMarriageHoliday();
            this.initFuneralLeave();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.beginTime = this.ruleForm.dateRange[0];
                        this.ruleForm.endTime = this.ruleForm.dateRange[1];
                        this.ruleForm.dateRange = null;
                        postRequest("/staff/myHoliday/leaveApply", this.ruleForm).then(resp => {
                            if (resp) {
                                this.$refs[formName].resetFields();
                                this.dialogVisible = false;
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancel(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
            },
            leaveApply() {
                this.ruleForm = {};
                this.dialogVisible = true;
            },
            initExchange() {
                let param = {};
                param.holidayType = 0;
                this.exchangeLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.exchangeLoading = false;
                        this.exchange = resp.data;
                    }
                })
            },
            initSickLeave() {
                let param = {};
                param.holidayType = 1;
                this.sickLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.sickLeaveLoading = false;
                        this.sickLeave = resp.data;
                    }
                })
            },
            initAnnualLeave() {
                let param = {};
                param.holidayType = 2;
                this.annualLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.annualLeaveLoading = false;
                        this.annualLeave = resp.data;
                    }
                })
            },
            initBreastfeedingLeave() {
                let param = {};
                param.holidayType = 3;
                this.breastfeedingLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.breastfeedingLeaveLoading = false;
                        this.breastfeedingLeave = resp.data;
                    }
                })
            },
            initMarriageHoliday() {
                let param = {};
                param.holidayType = 4;
                this.marriageHolidayLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.marriageHolidayLoading = false;
                        this.marriageHoliday = resp.data;
                    }
                })
            },
            initFuneralLeave() {
                let param = {};
                param.holidayType = 5;
                this.funeralLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.funeralLeaveLoading = false;
                        this.funeralLeave = resp.data;
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .el-card /deep/ .el-card__header {
        background-color: #D1EEEE;
    }
</style>
