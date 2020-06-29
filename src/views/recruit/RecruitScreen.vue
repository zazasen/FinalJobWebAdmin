<!--简历筛选-->
<template>
    <div>
        <div>
            <el-select v-model="queryForm.positionId" clearable filterable placeholder="职位"
                       style="width: 250px">
                <el-option v-for="(item,index) in positions" :key="index" :label="item.positionName"
                           :value="item.id"/>
            </el-select>

            <el-popover placement="right" width="500" v-model="queryVisible">
                <el-tree :data="depData" :props="defaultProps" @node-click="queryHandleNodeClick"
                         :expand-on-click-node="false"
                         style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="queryCancel">取消</el-button>
                    <el-button type="primary" size="mini" @click="queryVisible = false">确定
                    </el-button>
                </div>
                <el-button slot="reference" style="width: 250px;margin-left: 10px">
                    <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
                </el-button>
            </el-popover>

            <el-select v-model="queryForm.status" clearable filterable placeholder="职位"
                       style="width: 250px;margin-left: 10px">
                <el-option v-for="(item,index) in statusDate" :key="index" :label="item.desc"
                           :value="item.code"/>
            </el-select>

            <el-button style="margin-left: 10px" icon="el-icon-search" @click="queryResume">查询</el-button>
        </div>
        <div>
            <el-table :data="resumeData" style="width: 100%;margin-top: 10px" border stripe
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="name" label="姓名" align="center" width="100" fixed="left"></el-table-column>
                <el-table-column prop="departmentName" label="申请部门" align="center"></el-table-column>
                <el-table-column prop="positionName" label="申请职位" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="120"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" width="200"></el-table-column>
                <el-table-column prop="idCard" label="身份证号" align="center" width="200"></el-table-column>
                <el-table-column prop="createTime" label="申请时间" align="center" width="200"></el-table-column>
                <el-table-column prop="statusStr" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="typeDemo(scope.row.status)"
                                disable-transitions>{{scope.row.statusStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDetail(scope.row)">岗位详情</el-button>
                        <el-button type="text" size="small" @click="showResume(scope.row.url)">简历</el-button>
                        <el-button type="text" size="small" style="color: red" @click="edit(scope.row)">编辑</el-button>
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

        <el-dialog title="更改面试者状态" :visible.sync="dialogVisible" width="30%">
            <el-steps :active="currentStatus" align-center>
                <el-step :title=item.desc v-for="(item,index) in stepDate" :key="index"></el-step>
            </el-steps>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="pass" size="small">通过</el-button>
                <el-button type="danger" @click="noPass" size="small">不通过</el-button>
                <el-button type="info" @click="toPool" size="small">人才库</el-button>
                <el-button @click="defined" size="small">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "RecruitScreen",
        data() {
            return {
                currentStatus:null,
                dialogForm: {
                    name:null,
                    status: null,
                    id: null,
                },
                dialogVisible: false,
                resumeData: [],
                stepDate: [],
                loading: false,
                queryForm: {
                    status: null,
                    departmentId: null,
                    positionId: null,
                    pageIndex: 1,
                    pageSize: 10,
                },
                queryDepartmentName: "请选择部门",
                total: null,
                positions: [],
                depData: [],
                statusDate: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryVisible: false,
            }
        },
        mounted() {
            this.initPositions();
            this.initDepData();
            this.initResumeData();
            this.initResumeStatus();
            this.initStepDate();
        },
        methods: {
            defined() {
                this.updateStatus();
            },
            toPool() {
                this.$confirm('此操作将会将 <span style="color:red">' + this.dialogForm.name + '</span> 放入人才库,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.dialogForm.status = 5;
                    this.updateStatus();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            pass() {
                if (this.dialogForm.status < 4) {
                    this.currentStatus++;
                    this.dialogForm.status++;
                } else {
                    this.currentStatus = 0;
                    this.dialogForm.status = 0;
                }
            },
            noPass() {
                this.$confirm('<span style="color:red">' + this.dialogForm.name + '</span> 未通过筛选 ,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.dialogForm.status = 6;
                    this.updateStatus();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            edit(val) {
                if(val.status >= 5){
                    this.currentStatus = -1;
                }else {
                    this.currentStatus = val.status;
                }
                this.dialogForm.name = val.name;
                this.dialogForm.status = val.status;
                this.dialogForm.id = val.id;
                this.dialogVisible = true;
            },
            updateStatus() {
                postRequest("/recruit/screen/updateResumeStatus",this.dialogForm).then(resp=>{
                    if(resp){
                        this.initResumeData();
                        this.dialogVisible = false;
                    }
                })
            },
            initStepDate() {
                getRequest("/recruit/screen/getResumeStatusStep").then(resp => {
                    if (resp) {
                        this.stepDate = resp.data;
                    }
                })
            },
            initResumeStatus() {
                getRequest("/recruit/screen/getResumeStatus").then(resp => {
                    if (resp) {
                        this.statusDate = resp.data;
                    }
                })
            },
            showResume(val) {
                window.open(val, '_blank');
            },
            queryResume() {
                this.initResumeData();
            },
            showDetail(row) {
                window.sessionStorage.setItem("recruitBoardDetailId", row.staffNeedsId);
                let routeUrl = this.$router.resolve({path: "/recruitBoardDetail"});
                window.open(routeUrl.href, '_blank');
            },
            typeDemo(val) {
                if(val >= 0 && val <= 3){
                    return "primary";
                }
                if(val == 4){
                    return "success";
                }
                if(val == 5){
                    return "info";
                }
                if(val == 6){
                    return "danger";
                }
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
            initPositions() {
                getRequest("/recruit/screen/getPositions").then(resp => {
                    this.positions = resp.data;
                })
            },
            initDepData() {
                getRequest("/recruit/screen/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            initResumeData() {
                this.loading = true;
                postRequest("/recruit/screen/getResumes", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.resumeData = resp.data;
                        this.total = resp.total;
                    } else {
                        this.loading = false;
                    }
                })
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
                this.initResumeData();
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
                this.initResumeData();
            },
        }
    }
</script>

<style scoped>

</style>
