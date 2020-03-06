<template>
    <div>
        <div id="days" style="width: 600px;height:400px;"></div>
    </div>
</template>

<script>
    import {postRequest} from "../utils/RequestUtil";

    export default {
        name: "HomeComponent",
        data() {
            return {
                days: null,
            }
        },
        mounted() {
            this.getDays();
        },
        methods: {
            initPie(){
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
                            color: ["#4876FF", "#7A7A7A", "#FF3030"]
                        }
                    ]
                })
            },
            getDays() {
                postRequest("/home/getShouldBeWorkDays").then(resp => {
                    if (resp) {
                        this.days = resp.data;
                        this.initPie();
                    }
                })
            }
        }
    }
</script>

<style scoped>
</style>
