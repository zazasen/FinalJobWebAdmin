<template>
    <div>
        <div>
            <el-select v-model="queryData.holidayType" placeholder="请选择假期类型" style="width: 350px" clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.label"
                           :value="item.value"/>
            </el-select>
            <el-button style="margin-left: 10px" @click="initRecord">查询</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table :data="myAppliedHolidaysData" border style="width: 100%;margin-bottom: 10px"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="id" label="id" width="100" align="center"/>
                <el-table-column prop="holidayTypeStr" label="假期类型" align="center"/>
                <el-table-column prop="beginTime" label="假期开始时间" align="center"/>
                <el-table-column prop="endTime" label="假期结束时间" align="center"/>
                <el-table-column prop="reason" label="请假原因" align="center"/>
            </el-table>
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="queryData.pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "MyHolidayAppliedComponent",
        data() {
            return {
                loading: false,
                myAppliedHolidaysData: {},
                queryData: {
                    holidayType: null,
                    pageSize: 10,
                    pageIndex: 1
                },
                total: null,
                options: [{
                    value: '0',
                    label: '调休'
                }, {
                    value: '1',
                    label: '病假'
                }, {
                    value: '2',
                    label: '年假'
                }, {
                    value: '3',
                    label: '哺乳假'
                }, {
                    value: '4',
                    label: '婚假'
                }, {
                    value: '5',
                    label: '丧假'
                }, {
                    value: '6',
                    label: '事假'
                }],
            }
        },
        mounted() {
            this.initRecord();
        },
        methods: {
            initRecord() {
                this.loading = true;
                postRequest("/staff/myHoliday/getMyAppliedHolidays", this.queryData).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.myAppliedHolidaysData = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            sizeChange(val) {
                this.queryData.pageSize = val;
                this.initRecord();
            },
            currentChange(val) {
                this.queryData.pageIndex = val;
                this.initRecord();
            }
        }
    }
</script>

<style scoped>

</style>
