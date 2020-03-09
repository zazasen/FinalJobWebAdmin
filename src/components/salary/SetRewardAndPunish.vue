`
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
            <el-button style="margin-left: 10px" @click="initUsers">查询</el-button>
        </div>

        <div>
            <el-table :data="userDate" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="realName" label="员工姓名" align="center"/>
                <el-table-column prop="workId" label="工号" align="center"/>
                <el-table-column prop="departmentName" label="部门" align="center"/>
                <el-table-column prop="positionName" label="职位" align="center"/>
                <el-table-column prop="positionLevelName" label="职位级别" align="center"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDialog(scope.row)">添加奖惩</el-button>
                        <el-button type="text" size="small" @click="showDetail(scope.row)">查看奖惩</el-button>
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
        <el-dialog title="添加奖惩" :visible.sync="dialogVisible" width="40%">
            <div>
                <label style="margin-right: 20px;margin-left: 20px">奖惩金额</label>
                <el-input type="number" step="0.01" v-model="inputForm.money" autocomplete="off"
                          placeholder="正数为奖，负数为惩" style="width: 350px;"></el-input>
            </div>
            <div>
                <label style="margin-right: 20px;margin-left: 20px;">奖惩原因</label>
                <el-input type="textarea" v-model="inputForm.reason" style="width: 350px;margin-top: 10px"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addRewardAndPunish" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="奖惩列表" :visible.sync="detailDialog">
            <el-table :data="rewardAndPunishDetail">
                <el-table-column property="money" label="奖惩金额"></el-table-column>
                <el-table-column property="reason" label="奖惩原因"></el-table-column>
                <el-table-column property="createTime" label="创建时间"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "SetRewardAndPunish",
        data() {
            return {
                detailDialog: false,
                rewardAndPunishDetail: null,
                inputForm: {
                    money: null,
                    reason: null,
                    userId: null,
                },
                userDate: null,
                loading: false,
                dialogVisible: false,
                queryForm: {
                    realName: '',
                    workId: '',
                    departmentId: null,
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
            }
        },
        mounted() {
            this.initDepData();
            this.initUsers();
        },
        methods: {
            showDetail(row) {
                let params = {};
                params.userId = row.userId;
                postRequest("/salary/rewardAndPunish/queryRewardAndPunish", params).then(resp => {
                    this.rewardAndPunishDetail = resp.data;
                    this.detailDialog = true;
                })
            },
            showDialog(row) {
                this.dialogVisible = true;
                this.inputForm = {};
                this.inputForm.userId = row.userId;
            },
            addRewardAndPunish() {
                if (!this.inputForm.money) {
                    this.$message.error("请填写金额");
                    return;
                }
                if (!this.inputForm.reason) {
                    this.$message.error("请填写奖惩原因");
                    return;
                }
                postRequest("/salary/rewardAndPunish/addRewardAndPunish", this.inputForm).then(resp => {
                    if (resp) {
                        this.initUsers();
                        this.dialogVisible = false;
                    }
                })
            },
            initDepData() {
                getRequest("/salary/rewardAndPunish/getAllDepartment").then(resp => {
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
            initUsers() {
                this.loading = true;
                postRequest("/salary/rewardAndPunish/getUsers", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.userDate = resp.data;
                        this.total = resp.total;
                    }
                });
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initUsers();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initUsers();
            },
        }
    }
</script>

<style scoped>

</style>
`
