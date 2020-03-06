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

            <el-button style="margin-left: 10px" @click="initUserAccountSetData">查询</el-button>
        </div>
        <div>
            <el-table :data="userAccountSetData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="realName" label="员工姓名" align="center"/>
                <el-table-column prop="workId" label="工号" align="center"/>
                <el-table-column prop="phone" label="电话号码" align="center"/>
                <el-table-column prop="departmentName" label="部门" align="center"/>
                <el-table-column prop="positionName" label="职位" align="center"/>
                <el-table-column prop="positionLevelName" label="职位级别" align="center"/>
                <el-table-column prop="userAccountSet" label="薪资账套" align="center">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="right" class="item">
                            <div slot="content">
                                <table v-if="scope.row.accountSet">
                                    <tr>
                                        <td>基本工资</td>
                                        <td>￥{{scope.row.accountSet.basicSalary}}</td>
                                    </tr>
                                    <tr>
                                        <td>交通补助</td>
                                        <td>￥{{scope.row.accountSet.trafficAllowance}}</td>
                                    </tr>
                                    <tr>
                                        <td>通讯补助</td>
                                        <td>￥{{scope.row.accountSet.phoneAllowance}}</td>
                                    </tr>
                                    <tr>
                                        <td>餐饮补助</td>
                                        <td>￥{{scope.row.accountSet.foodAllowance}}</td>
                                    </tr>
                                    <tr>
                                        <td>养老金基数</td>
                                        <td>￥{{scope.row.accountSet.pensionBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>养老金比率</td>
                                        <td>{{scope.row.accountSet.pensionRatio}}</td>
                                    </tr>
                                    <tr>
                                        <td>医疗保险金基数</td>
                                        <td>￥{{scope.row.accountSet.medicareBenefitsBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>医疗保险金比率</td>
                                        <td>{{scope.row.accountSet.medicareBenefitsRatio}}</td>
                                    </tr>
                                    <tr>
                                        <td>失业保险金基数</td>
                                        <td>￥{{scope.row.accountSet.businessInsuranceBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>失业保险金比率</td>
                                        <td>{{scope.row.accountSet.businessInsuranceRatio}}</td>
                                    </tr>
                                    <tr>
                                        <td>工伤保险金基数</td>
                                        <td>￥{{scope.row.accountSet.industrialInsuranceBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>工伤保险金比率</td>
                                        <td>{{scope.row.accountSet.industrialInsuranceRatio}}</td>
                                    </tr>
                                    <tr>
                                        <td>生育保险基数</td>
                                        <td>￥{{scope.row.accountSet.birthInsuranceBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>生育保险比率</td>
                                        <td>{{scope.row.accountSet.birthInsuranceBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>住房公积金基数</td>
                                        <td>￥{{scope.row.accountSet.housingFundBasic}}</td>
                                    </tr>
                                    <tr>
                                        <td>住房公积金比率</td>
                                        <td>{{scope.row.accountSet.housingFundRatio}}</td>
                                    </tr>
                                    <tr>
                                        <td>个人所得税</td>
                                        <td>￥{{scope.row.accountSet.taxes}}</td>
                                    </tr>
                                    <tr>
                                        <td>最终工资</td>
                                        <td>￥{{scope.row.accountSet.finalSalary}}</td>
                                    </tr>
                                </table>
                            </div>
                            <el-tag :type="scope.row.userAccountSet === '尚未设置账套' ? 'danger' : 'success'"
                                    disable-transitions size="small">{{scope.row.userAccountSet}}
                            </el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="账套修改">
                    <template slot-scope="scope">
                        <el-popover placement="bottom" width="200" trigger="click" :ref="`popover-${scope.$index}`">
                            <el-select v-model="updateForm.accountSetId" placeholder="请选择" filterable clearable>
                                <el-option v-for="item in accountSet" :key="item.id" :label="item.accountName"
                                           :value="item.id"/>
                            </el-select>
                            <el-button size="mini" type="primary" style="margin-top: 10px" @click="define(scope)">确定
                            </el-button>
                            <el-button size="mini" style="margin-top: 10px" @click="cancel(scope)">取消</el-button>
                            <el-button type="text" slot="reference" @click="showPopover(scope)">薪资账套修改</el-button>
                        </el-popover>
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
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "SalaryUserAccountSet",
        data() {
            return {
                accountSet: null,
                userAccountSetData: null,
                loading: false,
                depData: [],
                queryForm: {
                    realName: '',
                    workId: '',
                    departmentId: null,
                    pageSize: 10,
                    pageIndex: 1,
                },
                updateForm: {
                    userId: null,
                    accountSetId: null,
                },
                total: null,
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryDepartmentName: "请选择部门",
                queryVisible: false,
            }
        },
        mounted() {
            this.initDepData();
            this.initUserAccountSetData();
            this.initAccountSet();
        },
        methods: {
            showPopover(scope) {
                this.updateForm.accountSetId = scope.row.accountSetId;
            },
            initAccountSet() {
                postRequest("/salary/userAccountSet/getAccountSet").then(resp => {
                    if (resp) {
                        this.accountSet = resp.data;
                    }
                })
            },
            define(scope) {
                this.updateForm.userId = scope.row.userId;
                postRequest("/salary/userAccountSet/updateAccount", this.updateForm).then(resp => {
                    if (resp) {
                        this.initUserAccountSetData();
                        scope._self.$refs[`popover-${scope.$index}`].doClose();
                    }
                });
            },
            cancel(scope) {
                scope._self.$refs[`popover-${scope.$index}`].doClose();
            },
            initUserAccountSetData() {
                this.loading = true;
                postRequest("/salary/userAccountSet/getUserAccountSet", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.userAccountSetData = resp.data;
                        this.total = resp.total;
                    }
                });
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initUserAccountSetData();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initUserAccountSetData();
            },
            initDepData() {
                getRequest("/salary/userAccountSet/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
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
        }
    }
</script>

<style scoped>
    .item{
        cursor: pointer;
    }
</style>
