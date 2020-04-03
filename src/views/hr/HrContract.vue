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

            <el-select v-model="queryForm.confirm" clearable placeholder="合同状态"
                       style="width: 200px;margin-left: 10px">
                <el-option v-for="(item,index) in confirms" :key="index" :label="item.name"
                           :value="item.id"/>
            </el-select>

            <el-button style="margin-left: 10px" @click="initContractData">查询</el-button>
        </div>

        <div>
            <el-table :data="contractData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading" size="small"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="realName" label="员工姓名" width="100" align="center" fixed="left"/>
                <el-table-column prop="workID" label="工号" width="100" align="center"/>
                <el-table-column prop="departmentName" label="部门" width="150" align="center"/>
                <el-table-column prop="phone" label="手机号码" align="center"/>
                <el-table-column prop="email" label="邮箱" align="center"/>
                <el-table-column prop="beginContractTime" label="合同开始日期" align="center"/>
                <el-table-column prop="endContractTime" label="合同结束日期" align="center"/>
                <el-table-column prop="confirm" label="签署状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="getType(scope.row)" disable-transitions>{{scope.row.confirmStr}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="getContract(scope.row)">查看合同</el-button>
                        <el-button type="text" size="small" @click="addContract(scope.row)">发起合同</el-button>
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
        name: "HrContract",
        data() {
            return {
                contractData: null,
                loading: false,
                queryForm: {
                    realName: '',
                    workId: '',
                    confirm:'',
                    departmentId: null,
                    workState: 1,
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
                confirms: [{
                    id: 0,
                    name: "未签署"
                }, {
                    id: 1,
                    name: "待签署"
                }, {
                    id: 2,
                    name: "已签署"
                }],
            }
        },
        mounted() {
            this.initDepData();
            this.initContractData();
        },
        methods: {
            addContract(row) {
                let params = {};
                params.userId = row.userId;
                postRequest("/hr/contract/addContract",params).then(resp=>{
                    if(resp){
                        this.initContractData();
                    }
                })
            },
            getContract(row) {
                window.open("/hr/contract/getContract?userId=" + row.userId);
            },
            getType(row) {
                if (row.confirm == 0) {
                    return 'danger';
                }
                if (row.confirm == 1) {
                    return 'primary';
                }
                if (row.confirm == 2){
                    return 'success';
                }
            },
            initContractData() {
                this.loading = true;
                postRequest("/hr/contract/getAllContract", this.queryForm).then(resp => {
                    if (resp) {
                        this.contractData = resp.data;
                        this.total = resp.total;
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                })
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initContractData();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initContractData();
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
            initDepData() {
                getRequest("/hr/contract/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
