<template>
    <div>
        <div>
            <el-input v-model="queryForm.realName" clearable placeholder="请输入员工名" style="width: 200px"/>
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
            <el-input v-model="queryForm.workId" clearable placeholder="请输入工号" style="width: 200px;margin-left: 10px"/>

            <el-select v-model="queryForm.workState" clearable placeholder="在职状态"
                       style="width: 200px;margin-left: 10px">
                <el-option v-for="(item,index) in workState" :key="index" :label="item.name"
                           :value="item.id"/>
            </el-select>

            <el-date-picker v-model="queryForm.month" type="month" placeholder="选择月" value-format="timestamp"
                            style="width: 200px;margin-left: 10px"/>

            <el-button style="margin-left: 10px" @click="initSalary">查询</el-button>

            <el-tooltip effect="dark" placement="top">
                <div slot="content">
                    薪资结算计算上个月薪资
                </div>
                <i class="fa fa-lightbulb-o" style="margin-left: 10px;margin-right: 10px"></i>
            </el-tooltip>

            <el-button @click="salaryHandle"
                       v-loading="calLoading"
                       element-loading-text="生成薪资中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)">薪资结算
            </el-button>
        </div>

        <div>
            <el-table :data="salaryData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="realName" label="员工姓名" width="100px" align="center" fixed="left"/>
                <el-table-column prop="workId" label="工号" width="100px" align="center"/>
                <el-table-column prop="departmentName" label="部门" width="100px" align="center"/>
                <el-table-column prop="basicSalary" label="基本工资" width="100px" align="center"></el-table-column>
                <el-table-column prop="trafficAllowance" label="交通补助" width="100px" align="center"></el-table-column>
                <el-table-column prop="phoneAllowance" label="通信补助" width="100px" align="center"></el-table-column>
                <el-table-column prop="foodAllowance" label="餐饮补助" width="100px" align="center"></el-table-column>
                <el-table-column prop="fiveAndOne" label="五险一金" width="100px" align="center"></el-table-column>
                <el-table-column prop="taxes" label="个人所得税" width="100px" align="center"></el-table-column>
                <el-table-column prop="checkInMoney" label="考勤扣除" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content">
                                {{scope.row.checkInReason}}
                            </div>
                            <span>{{scope.row.checkInMoney}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="rewardAndPunishMoney" label="奖惩" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content">
                                <div v-for="(item,index) in scope.row.rewardAndPunishes" :key="index">
                                    <span style="margin-right: 10px">奖惩金额: {{item.money}}</span>
                                    <span>奖惩原因: {{item.reason}}</span>
                                </div>
                            </div>
                            <span>{{scope.row.rewardAndPunishMoney}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="otherMoney" label="其他" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content">
                                {{scope.row.otherMoneyReason}}
                            </div>
                            <span>{{scope.row.otherMoney}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="finalSalary" label="实发工资" align="center" width="100px"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="200px"></el-table-column>
                <el-table-column label="操作" width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDialog(scope.row)">补差价</el-button>
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

        <el-dialog title="人工补差价" :visible.sync="dialogVisible" width="40%">
            <div>
                <label style="margin-right: 20px;margin-left: 20px">差价金额</label>
                <el-input type="number" step="0.01" v-model="inputForm.money" autocomplete="off"
                          placeholder="正数为加，负数为减" style="width: 350px;"></el-input>
            </div>
            <div>
                <label style="margin-right: 20px;margin-left: 20px;">差价原因</label>
                <el-input type="textarea" v-model="inputForm.reason" style="width: 350px;margin-top: 10px"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editSalary" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "SalaryHandle",
        data() {
            return {
                inputForm: {
                    money: null,
                    reason: null,
                    userId: null,
                    createTime:'',
                },
                calLoading: false,
                salaryData: null,
                loading: false,
                queryForm: {
                    realName: '',
                    workId: '',
                    departmentId: null,
                    month: '',
                    workState: '',
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
                queryVisible: false,
                workState: [{
                    id: 1,
                    name: "在职"
                }, {
                    id: 0,
                    name: "离职"
                }],
            }
        },
        mounted() {
            this.initDepData();
            this.initSalary();
        },
        methods: {
            showDialog(row) {
                this.dialogVisible = true;
                this.inputForm = {};
                this.inputForm.userId = row.userId;
                this.inputForm.createTime = row.createTime;
            },
            editSalary() {
                if (!this.inputForm.money) {
                    this.$message.error("请填写金额");
                    return;
                }
                if (!this.inputForm.reason) {
                    this.$message.error("请填写差价原因");
                    return;
                }
                postRequest("/salary/handle/editSalary", this.inputForm).then(resp => {
                    if (resp) {
                        this.initSalary();
                        this.dialogVisible = false;
                    }
                })
            },
            salaryHandle() {
                this.calLoading = true;
                postRequest("/salary/handle/salaryHandle").then(resp => {
                    if (resp) {
                        this.initSalary();
                        this.calLoading = false;
                    } else {
                        this.calLoading = false;
                    }
                })
            },
            initDepData() {
                getRequest("/salary/handle/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initSalary();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initSalary();
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
            initSalary() {
                postRequest("/salary/handle/getAllSalary", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.salaryData = resp.data;
                        this.total = resp.total;
                    } else {
                        this.calLoading = false;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
