<template>
    <div>
        <div>
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
                <el-table-column prop="id" label="id" width="100" align="center"/>
                <el-table-column prop="username" label="员工姓名" width="200" align="center"/>
                <el-table-column prop="startTime" label="上班签到时间" width="250" align="center"/>
                <el-table-column prop="startPlace" label="上班签到地址" width="200" align="center"/>
                <el-table-column prop="startTypeStr" label="上班签到类型" width="150" align="center"/>
                <el-table-column prop="endTime" label="下班签到时间" width="250" align="center"/>
                <el-table-column prop="endPlace" label="下班签到地址" width="200" align="center"/>
                <el-table-column prop="endTypeStr" label="下班签到类型" width="150" align="center"/>
                <el-table-column prop="signTypeStr" label="打卡状态" width="150" align="center"/>
                <el-table-column prop="workHoursStr" label="上班时长" width="150" align="center"/>
            </el-table>
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[5, 8, 10, 20]"
                           :page-size="pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "AttendanceAllRecordManager",
        data() {
            return {
                dateValue: [],
                loading: false,
                allAttendanceRecord: null,
                currentUser: null,
                pageIndex: 1,
                pageSize: 5,
                total: null,
                queryForm: {
                    startTime: '',
                    endTime: ''
                }
            }
        },
        mounted() {
            this.initRecord();
        },
        methods: {
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
                    }
                })
            }
        }
    }
</script>

<style>

</style>
