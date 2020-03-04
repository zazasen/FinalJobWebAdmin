<template>
    <div>
        <div>
            <el-date-picker v-model="dateValue" type="daterange" range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="timestamp"/>
            <el-button style="margin-left: 10px" @click="initRecord">查询</el-button>
        </div>

        <div style="margin-top: 10px">
            <el-table :data="attendanceRecord" border style="width: 100%;margin-bottom: 10px"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="id" label="id" width="100" align="center"/>
                <el-table-column prop="createTime" label="日期" width="250" align="center"/>
                <el-table-column prop="startTime" label="上班签到时间" width="250" align="center"/>
                <el-table-column prop="startPlace" label="上班签到地址" width="200" align="center"/>
                <el-table-column prop="startTypeStr" label="上班签到类型" width="150" align="center"/>
                <el-table-column prop="endTime" label="下班签到时间" width="250" align="center"/>
                <el-table-column prop="endPlace" label="下班签到地址" width="200" align="center"/>
                <el-table-column prop="endTypeStr" label="下班签到类型" width="150" align="center"/>
                <el-table-column prop="signTypeStr" label="打卡状态" width="150" align="center"/>
                <el-table-column prop="workHoursStr" label="上班时长" width="150" align="center"/>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="remedySign(scope.row)" type="text" size="small">补签</el-button>
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

        <el-dialog title="补签" :visible.sync="dialogVisible" width="30%">
            <div style="margin-bottom: 10px">
                <span style="margin-right: 10px">上班补卡</span>
                <el-time-picker
                        @focus="startFocus"
                        :editable="false"
                        v-model="updateData.startTime"
                        :picker-options="{selectableRange: '00:00:00 - 23:59:00'}"
                        placeholder="上班打卡">
                </el-time-picker>
                <el-button type="primary" size="mini" style="margin-left: 10px" @click="startApply">上班补卡</el-button>
            </div>
            <div>
                <span style="margin-right: 10px">下班补卡</span>
                <el-time-picker
                        @focus="endFocus"
                        :editable="false"
                        v-model="updateData.endTime"
                        :picker-options="{selectableRange: '00:00:00 - 23:59:00'}"
                        placeholder="下班补卡">
                </el-time-picker>
                <el-button type="success" size="mini" style="margin-left: 10px" @click="endApply">下班补卡</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "AttendanceRecord",
        data() {
            return {
                updateData: {
                    userId: null,
                    startTime: null,
                    endTime: null,
                    applyType: null,
                },
                dialogVisible: false,
                dateValue: [],
                loading: false,
                attendanceRecord: null,
                pageIndex: 1,
                pageSize: 10,
                total: null,
                queryForm: {
                    startTime: '',
                    endTime: ''
                },
                tempDate: '',
            }
        },
        mounted() {
            this.initRecord();
        },
        methods: {
            startApply() {
                this.updateData.endTime = null;
                // 签到补卡类型
                this.updateData.applyType = 0;
                if (!this.updateData.startTime) {
                    this.$message.error("上班打卡时间不能为空");
                    return;
                }
                this.updateData.startTime = this.updateData.startTime.getTime();
                postRequest("/staff/myAttendance/remedySign", this.updateData).then(resp => {
                    if (resp) {
                        this.dialogVisible = false;
                    }
                });
            },
            endApply() {
                this.updateData.startTime = null;
                // 签退补卡类型
                this.updateData.applyType = 1;
                if (!this.updateData.endTime) {
                    this.$message.error("下班打卡时间不能为空");
                    return;
                }
                this.updateData.endTime = this.updateData.endTime.getTime();
                postRequest("/staff/myAttendance/remedySign", this.updateData).then(resp => {
                    this.dialogVisible = false;
                });
            },
            startFocus() {
                this.updateData.startTime = new Date(this.tempDate);
            },
            endFocus() {
                this.updateData.endTime = new Date(this.tempDate);
            },
            remedySign(row) {
                let temp = Object.assign({}, row);
                this.updateData.startTime = null;
                this.updateData.endTime = null;
                this.updateData.userId = temp.userId;
                this.tempDate = temp.createTime;
                // 如果存在上班打卡
                if (temp.startTime) {
                    this.updateData.startTime = new Date(temp.startTime);
                } else {
                    // 不存在上班打卡
                    this.updateData.startTime = new Date(temp.createTime);
                }
                // 存在下班打卡
                if (temp.endTime) {
                    this.updateData.endTime = new Date(temp.endTime);
                } else {
                    // 不存在下班打卡
                    this.updateData.endTime = new Date(temp.createTime);
                }
                this.dialogVisible = true;
            },
            sizeChange() {
                this.initRecord();
            },
            currentChange() {
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
                postRequest("/staff/myAttendance/getAttendanceRecord", this.queryForm).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.total = resp.total;
                        this.attendanceRecord = resp.data;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
