<template>
    <div>
        <div>
            <el-button @click="leaveApply" type="info" style="border-radius: 0px;width: 100px">请假</el-button>
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
        name: "ApplyCenterComponent",
        data() {
            return {
                dialogVisible: false,
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
            }
        },
        methods: {
            leaveApply() {
                this.ruleForm = {};
                this.dialogVisible = true;
            },
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
        }
    }
</script>

<style scoped>

</style>
