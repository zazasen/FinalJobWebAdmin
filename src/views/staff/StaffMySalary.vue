<template>
    <div>
        <div>
            <el-date-picker v-model="queryForm.month" type="month" placeholder="选择月" value-format="timestamp"
                            style="width: 200px;"/>
            <el-button style="margin-left: 10px" @click="getMySalary">查询</el-button>
        </div>
        <div>
            <el-table :data="salaryData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="basicSalary" label="基本工资" align="center"></el-table-column>
                <el-table-column prop="trafficAllowance" label="交通补助" align="center"></el-table-column>
                <el-table-column prop="phoneAllowance" label="通信补助" align="center"></el-table-column>
                <el-table-column prop="foodAllowance" label="餐饮补助" align="center"></el-table-column>
                <el-table-column prop="fiveAndOne" label="五险一金" align="center"></el-table-column>
                <el-table-column prop="taxes" label="个人所得税" align="center"></el-table-column>
                <el-table-column prop="checkInMoney" label="考勤扣除" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content">
                                {{scope.row.checkInReason}}
                            </div>
                            <span>{{scope.row.checkInMoney}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="rewardAndPunishMoney" label="奖惩" align="center">
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
                <el-table-column prop="otherMoney" label="其他" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content">
                                {{scope.row.otherMoneyReason}}
                            </div>
                            <span>{{scope.row.otherMoney}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="finalSalary" label="实发工资" align="center"></el-table-column>
                <el-table-column prop="createTimeStr" label="创建时间" align="center"></el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="queryForm.pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "StaffMySalary",
        data() {
            return {
                loading:false,
                queryForm: {
                    month: '',
                    pageSize: 10,
                    pageIndex: 1,
                },
                total: null,
                salaryData: null,
            }
        },
        mounted() {
            this.getMySalary();
        },
        methods: {
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.getMySalary();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.getMySalary();
            },
            getMySalary() {
                this.loading = true;
                postRequest("/staff/mySalary/getMySalary", this.queryForm).then(resp => {
                    if (resp) {
                        this.salaryData = resp.data;
                        this.total = resp.total;
                        this.loading = false;
                    }else {
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
