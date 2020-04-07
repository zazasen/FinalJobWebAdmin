<!--员工考勤-->
<template>
    <div>
        <div>
            <el-input v-model="queryForm.realName" placeholder="请输入姓名" clearable style="width: 200px"></el-input>
            <el-popover placement="right" width="500" v-model="queryVisible">
                <el-tree :data="depData" :props="defaultProps" @node-click="queryHandleNodeClick"
                         :expand-on-click-node="false"
                         style="margin-left: 10px;width: 50%" :highlight-current="true"></el-tree>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="queryCancel">取消</el-button>
                    <el-button type="primary" size="mini" @click="queryVisible = false">确定
                    </el-button>
                </div>
                <el-button slot="reference" style="width: 200px;margin-left: 10px;margin-right: 10px">
                    <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
                </el-button>
            </el-popover>
            <el-date-picker v-model="dateValue" type="daterange" range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="timestamp"/>
            <el-button style="margin-left: 10px" @click="initRecord">查询</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table :data="allAttendanceRecord" border style="width: 100%;margin-bottom: 10px"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="username" label="员工姓名" width="100" align="center" fixed="left"/>
                <el-table-column prop="startTime" label="上班签到时间" width="170" align="center"/>
                <el-table-column prop="startPlace" label="上班签到地址" width="150" align="center"/>
                <el-table-column prop="startTypeStr" label="上班签到类型" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="typeDemo(scope.row.startType)"
                                disable-transitions>{{scope.row.startTypeStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="下班签到时间" width="170" align="center"/>
                <el-table-column prop="endPlace" label="下班签到地址" width="150" align="center"/>
                <el-table-column prop="endTypeStr" label="下班签到类型" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="typeDemo(scope.row.endType)"
                                disable-transitions>{{scope.row.endTypeStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="signTypeStr" label="打卡状态" width="90" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="signTypeDemo(scope.row.signType)"
                                disable-transitions>{{scope.row.signTypeStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="workHoursStr" label="上班时长" width="100" align="center"/>
                <el-table-column prop="createTime" label="日期" width="100" align="center" fixed="right"/>
                <el-table-column label="操作" fixed="right" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="updateCheckIn(scope.row)">人工补卡</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "AttendanceAllRecordManager",
        data() {
            return {
                queryVisible: false,
                depData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryDepartmentName: "请选择部门",
                dateValue: [],
                loading: false,
                allAttendanceRecord: null,
                currentUser: null,
                pageIndex: 1,
                pageSize: 10,
                total: null,
                queryForm: {
                    realName: '',
                    startTime: '',
                    endTime: '',
                    departmentId: '',
                }
            }
        },
        mounted() {
            this.initRecord();
            this.initDepData();
        },
        methods: {
            updateCheckIn(row) {
                let params = {};
                params.id = row.id;
                postRequest("/attendance/allRecord/updateCheckIn",params).then(resp=>{
                    if(resp){
                        this.initRecord();
                    }
                })
            },
            initDepData() {
                getRequest("/attendance/allRecord/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            queryCancel() {
                this.queryVisible = false;
                this.queryDepartmentName = "请选择部门";
                this.queryForm.departmentId = null;
            },
            queryHandleNodeClick(data) {
                this.queryForm.departmentId = data.id;
                this.queryDepartmentName = data.name;
            },
            signTypeDemo(type) {
                if (type == null) {
                    return 'info';
                }
                if (type == 0 || type == 3) {
                    return 'danger';
                }
                if (type == 1) {
                    return 'primary';
                }
                if (type == 2) {
                    return 'success';
                }
            },
            typeDemo(type) {
                if (type == null) {
                    return 'danger';
                }
                if (type == 0) {
                    return 'primary';
                }
                if (type == 1) {
                    return 'primary';
                }
                if (type == 2) {
                    return 'success';
                }
                if (type == 3) {
                    return 'danger';
                }
            },
            sizeChange(val) {
                this.pageSize = val;
                this.initRecord();
            },
            currentChange(val) {
                this.pageIndex = val;
                this.initRecord();
            },
            initRecord() {
                this.loading = true;
                this.queryForm.pageIndex = this.pageIndex;
                this.queryForm.pageSize = this.pageSize;
                if (this.dateValue && this.dateValue.length > 0) {
                    this.queryForm.startTime = this.dateValue[0];
                    this.queryForm.endTime = this.dateValue[1];
                } else {
                    this.queryForm.startTime = "";
                    this.queryForm.endTime = "";
                }
                postRequest("/attendance/allRecord/getAllAttendanceRecord", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.total = resp.total;
                        this.allAttendanceRecord = resp.data;
                    } else {
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style>

</style>
