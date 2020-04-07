<template>
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
            <el-button slot="reference" style="width: 200px;margin-left: 40px">
                <span style="color: #C0C0C0">{{queryDepartmentName}}</span>
            </el-button>
        </el-popover>

        <el-date-picker v-model="queryForm.date" type="month" value-format="timestamp"
                        placeholder="选择月份" style="margin-left: 10px">
        </el-date-picker>

        <el-button style="margin-left: 10px" @click="getStatisticsDate">查询</el-button>
        <div id="main" style="height: 400px;width: 500px;margin-top: 50px"></div>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "HrStatistics",
        data(){
            return{
                depData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                queryDepartmentName: "请选择部门",
                queryVisible: false,
                queryForm: {
                    departmentId: '',
                    date: '',
                },
                statisticsDate: {},
            }
        },
        mounted() {
            this.initDepData();
            this.getStatisticsDate();
            this.initDate();
        },
        methods:{
            queryCancel() {
                this.queryVisible = false;
                this.queryDepartmentName = "请选择部门";
                this.queryForm.departmentId = null;
            },
            queryHandleNodeClick(data) {
                this.queryForm.departmentId = data.id;
                this.queryDepartmentName = data.name;
            },
            initDepData() {
                getRequest("/attendance/statistics/getAllDepartment").then(resp => {
                    if (resp) {
                        this.depData = resp.data;
                    }
                })
            },
            getStatisticsDate() {
                postRequest("/hr/statistics/getStatisticsDate", this.queryForm).then(resp => {
                    if (resp) {
                        this.statisticsDate = resp.data;
                        this.initDate();
                    }
                })
            },
            initDate() {
                let echarts = require('echarts');
                // 基于准备好的dom，初始化echarts图表
                let myChart = echarts.init(document.getElementById('main'));
                let option = {
                    tooltip: {
                        show: true
                    },
                    title:{
                        text: this.statisticsDate.statisticsUsersDate + '月员工统计',
                        textStyle:{					//---主标题内容样式
                            color:'#4876FF'
                        },
                        padding:[10,0,50,50]				//---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},        // 辅助线标志
                            dataView: {show: true, readOnly: false},    // 数据视图
                            magicType: {show: true, type: ['line', 'bar']},    // 动态类型转换（折线柱形互转）
                            restore: {show: true},        // 还原
                            saveAsImage: {show: true}        // 保存图片
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        data: ["入职人数", "转正人数", "离职人数"]
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        "type": "bar",
                        "data": this.statisticsDate.data,
                        itemStyle: {
                            normal: {
                                //这里是重点
                                color: function (params) {
                                    //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                    let colorList = ['#87CEFA','#FFD700', '#c23531'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        }
    }
</script>

<style scoped>

</style>
