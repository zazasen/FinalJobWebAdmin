<template>
    <div>
        <div style="float: right;margin-bottom: 20px">
            <el-button type="primary" @click="showAddAccountSetDialog">添加账套</el-button>
        </div>
        <div>
            <el-table :data="accountSetData" style="width: 100%" size="small"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="accountName" label="账套名称" width="150" align="center"
                                 fixed="left"></el-table-column>
                <el-table-column prop="basicSalary" label="基本工资" width="100" align="center"></el-table-column>
                <el-table-column prop="trafficAllowance" label="交通补助" width="100" align="center"></el-table-column>
                <el-table-column prop="phoneAllowance" label="通信补助" width="100" align="center"></el-table-column>
                <el-table-column prop="foodAllowance" label="餐饮补助" width="100" align="center"></el-table-column>
                <el-table-column label="养老保险金" align="center">
                    <el-table-column prop="pensionBasic" label="基数" width="100" align="center"></el-table-column>
                    <el-table-column prop="pensionRatio" label="比率" width="100" align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="医疗保险金" align="center">
                    <el-table-column prop="medicareBenefitsBasic" label="基数" width="100"
                                     align="center"></el-table-column>
                    <el-table-column prop="medicareBenefitsRatio" label="比率" width="100"
                                     align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="失业保险金" align="center">
                    <el-table-column prop="businessInsuranceBasic" label="基数" width="100"
                                     align="center"></el-table-column>
                    <el-table-column prop="businessInsuranceRatio" label="比率" width="100"
                                     align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="工伤保险金" align="center">
                    <el-table-column prop="industrialInsuranceBasic" label="基数" width="100"
                                     align="center"></el-table-column>
                    <el-table-column prop="industrialInsuranceRatio" label="比率" width="100"
                                     align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="生育保险金" align="center">
                    <el-table-column prop="birthInsuranceBasic" label="基数" width="100" align="center"></el-table-column>
                    <el-table-column prop="birthInsuranceRatio" label="比率" width="100" align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="住房公积金" align="center">
                    <el-table-column prop="housingFundBasic" label="基数" width="100" align="center"></el-table-column>
                    <el-table-column prop="housingFundRatio" label="比率" width="100" align="center"></el-table-column>
                </el-table-column>
                <el-table-column prop="taxes" label="个人所得税" width="100" align="center"></el-table-column>
                <el-table-column prop="finalSalary" label="最终工资" width="100" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" style="color: red" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="queryFrom.pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>

        <el-dialog title="新增账套" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="账套名" prop="accountName" style="width: 350px">
                            <el-input v-model="ruleForm.accountName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="基本工资" prop="basicSalary" style="width: 350px;">
                            <el-input type="number" step="0.01" v-model="ruleForm.basicSalary"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="交通补助" prop="trafficAllowance" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.trafficAllowance"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通讯补助" prop="phoneAllowance" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.phoneAllowance"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="餐饮补助" prop="foodAllowance" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.foodAllowance"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="养老金基数" prop="pensionBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.pensionBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="养老金比率" prop="pensionRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.pensionRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="医疗保险基数" prop="medicareBenefitsBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.medicareBenefitsBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医疗保险比率" prop="medicareBenefitsRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.medicareBenefitsRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="失业保险基数" prop="businessInsuranceBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.businessInsuranceBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="失业保险比率" prop="businessInsuranceRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.businessInsuranceRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="工伤保险基数" prop="industrialInsuranceBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.industrialInsuranceBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工伤保险比率" prop="industrialInsuranceRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.industrialInsuranceRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生育保险基数" prop="birthInsuranceBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.birthInsuranceBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生育保险比率" prop="birthInsuranceRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.birthInsuranceRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公积金基数" prop="housingFundBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.housingFundBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公积金比率" prop="housingFundRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="ruleForm.housingFundRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')" size="small">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="更新账套" :visible.sync="editDialogVisible" width="60%" :before-close="handleClose">
            <el-form :model="editRuleForm" :rules="rules" ref="editRuleForm" label-width="130px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="账套名" prop="accountName" style="width: 350px">
                            <el-input v-model="editRuleForm.accountName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="基本工资" prop="basicSalary" style="width: 350px;">
                            <el-input type="number" step="0.01" v-model="editRuleForm.basicSalary"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="交通补助" prop="trafficAllowance" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.trafficAllowance"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通讯补助" prop="phoneAllowance" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.phoneAllowance"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="餐饮补助" prop="foodAllowance" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.foodAllowance"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="养老金基数" prop="pensionBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.pensionBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="养老金比率" prop="pensionRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.pensionRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="医疗保险基数" prop="medicareBenefitsBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.medicareBenefitsBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医疗保险比率" prop="medicareBenefitsRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.medicareBenefitsRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="失业保险基数" prop="businessInsuranceBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.businessInsuranceBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="失业保险比率" prop="businessInsuranceRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.businessInsuranceRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="工伤保险基数" prop="industrialInsuranceBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.industrialInsuranceBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工伤保险比率" prop="industrialInsuranceRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.industrialInsuranceRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生育保险基数" prop="birthInsuranceBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.birthInsuranceBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生育保险比率" prop="birthInsuranceRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.birthInsuranceRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公积金基数" prop="housingFundBasic" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.housingFundBasic"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公积金比率" prop="housingFundRatio" style="width: 350px">
                            <el-input type="number" step="0.01" v-model="editRuleForm.housingFundRatio"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('editRuleForm')" size="small">取 消</el-button>
                <el-button type="primary" @click="editSubmitForm('editRuleForm')" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "SalaryAccountSet",
        data() {
            return {
                loading:false,
                editDialogVisible: false,
                dialogVisible: false,
                accountSetData: null,
                total: null,
                queryFrom: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                ruleForm: {
                    accountName: '初级初级技术',
                    basicSalary: null,
                    trafficAllowance: 100,
                    phoneAllowance: 100,
                    foodAllowance: 600,
                    pensionBasic: null,
                    pensionRatio: 0.08,
                    medicareBenefitsBasic: null,
                    medicareBenefitsRatio: 0.02,
                    businessInsuranceBasic: null,
                    businessInsuranceRatio: 0.005,
                    industrialInsuranceBasic: null,
                    industrialInsuranceRatio: 0,
                    birthInsuranceBasic: null,
                    birthInsuranceRatio: 0,
                    housingFundBasic: null,
                    housingFundRatio: 0.07,
                },
                editRuleForm: {},
                rules: {
                    accountName: [
                        {required: true, message: '请输入账套名', trigger: 'blur'},
                    ],
                    basicSalary: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    trafficAllowance: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    phoneAllowance: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    foodAllowance: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    pensionBasic: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    pensionRatio: [
                        {required: true, message: '请填写正确的金额，保留三位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$)/},
                    ],
                    medicareBenefitsBasic: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    medicareBenefitsRatio: [
                        {required: true, message: '请填写正确的金额，保留三位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$)/},
                    ],
                    businessInsuranceBasic: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    businessInsuranceRatio: [
                        {required: true, message: '请填写正确的金额，保留三位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$)/},
                    ],
                    industrialInsuranceBasic: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    industrialInsuranceRatio: [
                        {required: true, message: '请填写正确的金额，保留三位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$)/},
                    ],
                    birthInsuranceBasic: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    birthInsuranceRatio: [
                        {required: true, message: '请填写正确的金额，保留三位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$)/},
                    ],
                    housingFundBasic: [
                        {required: true, message: '请填写正确的金额，保留两位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$)/},
                    ],
                    housingFundRatio: [
                        {required: true, message: '请填写正确的金额，保留三位小数', pattern: /(^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$)/},
                    ]
                }
            }
        },
        mounted() {
            this.initAccountSetData();
        },
        methods: {
            edit(row) {
                this.editDialogVisible = true;
                let params = Object.assign({}, row);
                this.editRuleForm = params;
                this.editRuleForm.id = params.id;
            },
            del(row) {
                this.$confirm('此操作将删除 <span style="color:red">' + row.accountName + '</span> 账套,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    let params = {};
                    params.id = row.id;
                    postRequest("/salary/accountSet/delAccountSet", params).then(resp => {
                        if (resp) {
                            this.initAccountSetData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.resetForm('ruleForm');
                        this.resetForm('editRuleForm');
                        this.dialogVisible = false;
                        this.editDialogVisible = false;
                    })
                    .catch(_ => {
                    });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        postRequest("/salary/accountSet/addAccountSet", this.ruleForm).then(resp => {
                            if (resp) {
                                this.initAccountSetData();
                                this.dialogVisible = false;
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        postRequest("/salary/accountSet/editAccountSet", this.editRuleForm).then(resp => {
                            if (resp) {
                                this.initAccountSetData();
                                this.editDialogVisible = false;
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.editDialogVisible = false;
            },
            showAddAccountSetDialog() {
                this.dialogVisible = true;
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initAccountSetData();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initAccountSetData();
            },
            initAccountSetData() {
                this.loading = true;
                postRequest("/salary/accountSet/queryAccountSet", this.queryFrom).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.accountSetData = resp.data;
                        this.total = resp.total;
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>
