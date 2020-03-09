<template>
    <div class="border" style="display: flex;justify-content: space-between">
        <div style="width: 30%">
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
                    <div id="days" style="width: 380px;height:200px"></div>
                    <div class="c1">
                        <div style="margin-left: 20px">
                            <div style="margin-bottom: 5px">{{already}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #1E90FF"/>实际出勤（天）</div>
                        </div>
                        <div style="margin-right: 20px">
                            <div style="margin-bottom: 5px">{{none}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #EE3B3B"/>未出勤（天）</div>
                        </div>
                    </div>
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
        <div class="border" style="margin:10px 10px 10px 10px;width: 70%">
            <AttendanceCalendar/>
        </div>
    </div>
</template>

<script>
    import {postRequest} from "../utils/RequestUtil";
    import AttendanceCalendar from "./staff/AttendanceCalendar";

    export default {
        name: "HomeComponent",
        data() {
            return {
                days: null,
                already: null,
                none: null,
                leaveInfo: [],
            }
        },
        components: {
            AttendanceCalendar: AttendanceCalendar,
        },
        mounted() {
            this.getDays();
            this.getLeaveInfo();
        },
        methods: {
            getLeaveInfo() {
                postRequest("/home/getLeaveInfo").then(resp => {
                    if (resp) {
                        this.leaveInfo = resp.data;
                    }
                })
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
            getDays() {
                postRequest("/home/getShouldBeWorkDays").then(resp => {
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
                })
            }
        }
    }
</script>

<style scoped>
    .border {
        border-style: solid;
        border-width: 1px;
        border-color: #CFCFCF
    }

    .t1 {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #7A7A7A;
    }

    .c1 {
        font-size: 15px;
        text-align: center;
        margin-bottom: 20px;
        margin-top: 10px;
        display: flex;
        justify-content: space-between
    }
</style>
