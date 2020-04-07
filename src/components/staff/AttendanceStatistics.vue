<!--考勤统计-->
<template>
    <div>
        <div style="margin-left: 10px">
            <el-date-picker v-model="queryForm.month" type="month" value-format="timestamp" placeholder="选择月"></el-date-picker>
            <el-button style="margin-left: 10px" @click="query">查询</el-button>
        </div>
        <el-card style="margin:10px 0px 10px 10px" shadow="never">
            <div slot="header">
                <span>出勤统计</span>
                <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                        休息日打卡请走加班申请渠道哦，休息日打卡不算考勤范围内
                    </div>
                    <i class="fa fa-lightbulb-o" style="margin-top: 10px;margin-left: 10px"></i>
                </el-tooltip>
            </div>
            <div>
                <div id="days" style="width: 500px;height:250px;margin: 0 auto;"></div>
                <div style="margin-bottom: 20px">
                    <div style="float: left">
                        <i class="fa fa-circle" style="margin-right: 15px;color: #1E90FF"/>实际出勤：{{already}} 天
                    </div>
                    <div style="float: right">
                        <i class="fa fa-circle" style="margin-right: 15px;color: #EE3B3B"/>未出勤：{{none}} 天
                    </div>
                </div>
            </div>
        </el-card>
        <el-card style="margin:10px 0px 10px 10px" shadow="never">
            <div slot="header">
                <span>异常考勤</span>
                <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                        现有工时:有打卡的日期的出勤汇总<br/>
                        总需工时:有打卡的日期的最少需要工作的时长
                    </div>
                    <i class="fa fa-lightbulb-o" style="margin-top: 10px;margin-left: 10px"></i>
                </el-tooltip>
            </div>
            <div style="display: flex;justify-content: space-between;margin-top: 20px;margin-bottom: 20px">
                <div><i class="fa fa-circle" style="margin-right: 15px;color: #1E90FF"/>早退：{{early}} 天</div>
                <div><i class="fa fa-circle" style="margin-right: 15px;color: #EE3B3B"/>迟到：{{late}} 天</div>
                <div><i class="fa fa-circle" style="margin-right: 15px;color: #00FA9A"/>现有工时：{{worked}} 小时</div>
                <div><i class="fa fa-circle" style="margin-right: 15px;color: #9400D3"/>总需工时：{{already * 8}} 小时</div>
            </div>
        </el-card>
        <el-card style="margin:10px 0px 10px 10px" shadow="never">
            <div slot="header">
                <span>本月请假信息</span>
            </div>
            <div v-for="(item,index) in leaveInfo" :key="index">
                <el-tag style="margin-top: 5px">{{item.leaveType}}</el-tag>
                {{item.time}}
            </div>
        </el-card>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "AttendanceStatistics",
        data(){
            return{
                queryForm:{
                    month:'',
                },
                days: null,
                already: null,
                none: null,
                needDay: null,
                early: null,
                late: null,
                worked: null,
                leaveInfo: [],
                exceptionCheckIn: [],
            }
        },
        mounted() {
            this.getDays();
            this.initExceptionCheckIn();
            this.getLeaveInfo();
        },
        methods:{
            query(){
                this.getDays();
                this.initExceptionCheckIn();
                this.getLeaveInfo();
            },
            getLeaveInfo() {
                postRequest("/staff/myAttendance/getLeaveInfo",this.queryForm).then(resp => {
                    if (resp) {
                        this.leaveInfo = resp.data;
                    }
                })
            },
            initExceptionCheckIn() {
                postRequest("/staff/myAttendance/getExceptionCheckIn",this.queryForm).then(resp => {
                    this.exceptionCheckIn = resp.data;
                    for (let i in this.exceptionCheckIn) {
                        if (this.exceptionCheckIn[i].name === '早退') {
                            this.early = this.exceptionCheckIn[i].value;
                        } else if (this.exceptionCheckIn[i].name === '迟到') {
                            this.late = this.exceptionCheckIn[i].value;
                        } else if (this.exceptionCheckIn[i].name === '已工作工时') {
                            this.worked = this.exceptionCheckIn[i].value;
                        } else if (this.exceptionCheckIn[i].name === '总工时') {
                            this.needDay = this.exceptionCheckIn[i].value;
                        }
                    }
                })
            },
            getDays() {
                postRequest("/staff/myAttendance/getShouldBeWorkDays",this.queryForm).then(resp => {
                    if (resp) {
                        this.days = resp.data;
                        for (let i in this.days) {
                            if (this.days[i].name === '已打卡') {
                                this.already = this.days[i].value;
                            } else if (this.days[i].name === '未打卡') {
                                this.none = this.days[i].value;
                            }
                        }
                        this.initPie();
                    }
                });
            },
            initPie() {
                let echarts = require('echarts');
                let myChart = echarts.init(document.getElementById('days'));
                // 绘制图表
                myChart.setOption({
                    series: [
                        {
                            name: '考勤统计',
                            type: 'pie',    // 设置图表类型为饼图
                            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                            data: this.days,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b} : {c} ({d}%)'
                                    },
                                    labelLine: {show: true}
                                }
                            },
                            color: ["#4876FF", "#7A7A7A", "#FF3030", "#EEB422"]
                        }
                    ]
                })
            },
        }
    }
</script>

<style scoped>
</style>
