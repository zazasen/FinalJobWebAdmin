<template>
    <div>
        <div>
            <el-popover placement="right" width="500" v-model="queryVisible">
                <el-tree :data="depData" :props="defaultProps" @node-click="queryHandleNodeClick"
                         :expand-on-click-node="false"
                         style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="queryCancel">取消</el-button>
                    <el-button type="primary" size="mini" @click="queryVisible = false">确定
                    </el-button>
                </div>
                <el-button slot="reference" style="width: 300px">
                    <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
                </el-button>
            </el-popover>
        </div>
        <div>
            <el-table :data="staffNeedsDate" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="realName" label="申请人" align="center" fixed="left"></el-table-column>
                <el-table-column prop="departmentName" label="申请部门" align="center"></el-table-column>
                <el-table-column prop="applyDate" label="申请时间" width="200" align="center"></el-table-column>
                <el-table-column prop="address" label="岗位地址" align="center"></el-table-column>
                <el-table-column prop="positionName" label="申请职位" align="center"></el-table-column>
                <el-table-column prop="needNumber" label="招聘人数" width="100" align="center"></el-table-column>
                <el-table-column prop="degreeStr" label="最低学历" align="center" width="100"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" style="color: red">删除</el-button>
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
        name: "RecruitBoard",
        data() {
            return {
                loading: false,
                staffNeedsDate: null,
                total: null,
                queryForm: {
                    departmentId: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
                queryVisible: false,
                depData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryDepartmentName: "请选择部门",
            }
        },
        mounted() {
            this.initDepData();
            this.initStaffNeedsDate();
        },
        methods: {
            showDetail(row) {
                window.sessionStorage.setItem("recruitBoardDetailId", row.id);
                let routeUrl = this.$router.resolve({path: "/recruitBoardDetail"});
                window.open(routeUrl.href, '_blank');
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
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
                getRequest("/recruit/board/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            initStaffNeedsDate() {
                this.loading = true;
                postRequest("/recruit/board/getStaffNeedsDate", this.queryForm).then(resp => {
                    if (resp) {
                        this.staffNeedsDate = resp.data;
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
