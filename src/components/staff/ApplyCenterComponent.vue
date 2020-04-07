<template>
    <div>
        <div>
            <el-button style="border-radius: 0px" @click="overtimeApply">加班申请</el-button>
            <el-button @click="leaveApply" type="primary" style="border-radius: 0px">请假申请</el-button>
            <el-button @click="quitJobApply" type="danger" style="border-radius: 0px">离职申请</el-button>
            <el-button type="success" @click="conversionApply" style="margin-left: 10px">转正申请</el-button>
        </div>

        <el-dialog title="加班申请" :visible.sync="overtimeDialogVisible" width="40%">
            <div>
                <label style="margin-right: 20px;margin-left: 20px">加班时间</label>
                <el-date-picker v-model="overtimeForm.dateRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" value-format="timestamp">
                </el-date-picker>
            </div>
            <div>
                <label style="margin-right: 20px;margin-left: 20px;">加班原因</label>
                <el-input type="textarea" v-model="overtimeForm.reason" style="width: 350px;margin-top: 10px"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="overtimeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="overtimeDefine">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="离职申请" :visible.sync="QuitJobDialogVisible" width="40%">
            <div>
                <label style="margin-right: 20px;margin-left: 20px;">离职时间</label>
                <el-date-picker v-model="quitJobForm.leaveTime" type="date" placeholder="选择日期"
                                value-format="timestamp"
                                style="width: 350px;margin-top: 10px"/>
            </div>

            <div>
                <label style="margin-right: 20px;margin-left: 20px;">离职原因</label>
                <el-input type="textarea" v-model="quitJobForm.reason" style="width: 350px;margin-top: 10px"/>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="QuitJobDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="quitJobDefine">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="转正申请" :visible.sync="conversionDialogVisible" width="40%">
            <div>
                <label style="margin-right: 20px;margin-left: 20px;">转正原因</label>
                <el-input type="textarea" v-model="conversionForm.reason" style="width: 350px;margin-top: 10px"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="conversionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="conversionDefine">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="请假申请" :visible.sync="dialogVisible" width="40%">
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
        name: "ApplyCenterComponent",
        data() {
            return {
                overtimeDialogVisible: false,
                dialogVisible: false,
                QuitJobDialogVisible: false,
                conversionDialogVisible: false,
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
                }, {
                    value: '6',
                    label: '事假'
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
                overtimeForm: {
                    dateRange: [],
                    startTime: null,
                    endTime: null,
                    reason: null
                },
                quitJobForm: {
                    leaveTime: null,
                    reason: null,
                },
                conversionForm: {
                    reason: null,
                }
            }
        },
        methods: {
            leaveApply() {
                this.ruleForm = {};
                this.dialogVisible = true;
            },
            overtimeApply() {
                this.overtimeForm = {};
                this.overtimeDialogVisible = true;
            },
            quitJobApply() {
                this.quitJobForm = {};
                this.QuitJobDialogVisible = true;
            },
            conversionApply() {
                this.conversionForm = {};
                this.conversionDialogVisible = true;
            },
            quitJobDefine() {
                if (!this.quitJobForm.leaveTime) {
                    this.$message.error("请输入离职时间");
                    return;
                }
                if (!this.quitJobForm.reason) {
                    this.$message.error("请输入离职原因");
                    return;
                }
                postRequest("/staff/myRecord/quitJobApply", this.quitJobForm).then(resp => {
                    if (resp) {
                        this.QuitJobDialogVisible = false;
                    }
                });
            },

            conversionDefine() {
                if (!this.conversionForm.reason) {
                    this.$message.error("请输入转正理由");
                    return;
                }
                postRequest("/staff/myRecord/conversionApply", this.conversionForm).then(resp => {
                    if (resp) {
                        this.conversionDialogVisible = false;
                    }
                });
            },

            overtimeDefine() {
                if (!this.overtimeForm.dateRange) {
                    this.$message.error("请选择加班时间范围");
                    return;
                }
                if (!this.overtimeForm.reason) {
                    this.$message.error("请添加加班事由");
                    return;
                }
                this.overtimeForm.startTime = this.overtimeForm.dateRange[0];
                this.overtimeForm.endTime = this.overtimeForm.dateRange[1];
                this.overtimeForm.dateRange = null;
                // todo
                postRequest("/staff/myRecord/overtimeApply", this.overtimeForm).then(resp => {

                });
                this.overtimeDialogVisible = false;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.beginTime = this.ruleForm.dateRange[0];
                        this.ruleForm.endTime = this.ruleForm.dateRange[1];
                        this.ruleForm.dateRange = null;
                        postRequest("/staff/myRecord/leaveApply", this.ruleForm).then(resp => {
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
        }
    }
</script>

<style scoped>

</style>
