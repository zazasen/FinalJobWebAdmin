<template>
    <div style="margin-top: 50px">
        <el-row :gutter="50" style="margin-left: 50px">
            <el-col :span="7">
                <el-card shadow="never"
                         v-loading="exchangeLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div slot="header">
                        <span>{{exchange.createTime}} 年调休</span>
                    </div>
                    <div>
                        <div><span>总共可调 {{exchange.holidayTime}} 天</span></div>
                        <div><span>剩余可调 {{exchange.remaining}} 天</span></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="never"
                         v-loading="sickLeaveLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div slot="header">
                        <span>{{sickLeave.createTime}} 年病假</span>
                    </div>
                    <div>
                        <div><span>总共可请 {{sickLeave.holidayTime}} 天</span></div>
                        <div><span>剩余可请 {{sickLeave.remaining}} 天</span></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="never"
                         v-loading="annualLeaveLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div slot="header">
                        <span>{{annualLeave.createTime}} 年年假</span>
                    </div>
                    <div>
                        <div><span>总共可请 {{annualLeave.holidayTime}} 天</span></div>
                        <div><span>剩余可请 {{annualLeave.remaining}} 天</span></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="50" style="margin-left: 50px;margin-top: 50px">
            <el-col :span="7">
                <el-card shadow="never"
                         v-loading="breastfeedingLeaveLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div slot="header">
                        <span>{{breastfeedingLeave.createTime}} 年哺乳假</span>
                    </div>
                    <div>
                        <div><span>总共可请 {{breastfeedingLeave.holidayTime}} 天</span></div>
                        <div><span>剩余可请 {{breastfeedingLeave.remaining}} 天</span></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="never"
                         v-loading="marriageHolidayLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div slot="header">
                        <span>{{marriageHoliday.createTime}} 年婚假</span>
                    </div>
                    <div>
                        <div><span>总共可请 {{marriageHoliday.holidayTime}} 天</span></div>
                        <div><span>剩余可请 {{marriageHoliday.remaining}} 天</span></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="never"
                         v-loading="funeralLeaveLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div slot="header">
                        <span>{{funeralLeave.createTime}} 年丧假</span>
                    </div>
                    <div>
                        <div><span>总共可请 {{funeralLeave.holidayTime}} 天</span></div>
                        <div><span>剩余可请 {{funeralLeave.remaining}} 天</span></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "StaffMyHolidayComponent",
        data() {
            return {
                // 调休
                exchange: {},
                // 病假
                sickLeave: {},
                // 年假
                annualLeave: {},
                // 哺乳假
                breastfeedingLeave: {},
                // 婚假
                marriageHoliday: {},
                // 丧假
                funeralLeave: {},
                exchangeLoading: false,
                sickLeaveLoading: false,
                annualLeaveLoading: false,
                funeralLeaveLoading: false,
                breastfeedingLeaveLoading: false,
                marriageHolidayLoading: false,
            }
        },
        mounted() {
            this.initExchange();
            this.initSickLeave();
            this.initAnnualLeave();
            this.initBreastfeedingLeave();
            this.initMarriageHoliday();
            this.initFuneralLeave();
        },
        methods: {
            initExchange() {
                let param = {};
                param.holidayType = 0;
                this.exchangeLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.exchangeLoading = false;
                        this.exchange = resp.data;
                    }
                })
            },
            initSickLeave() {
                let param = {};
                param.holidayType = 1;
                this.sickLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.sickLeaveLoading = false;
                        this.sickLeave = resp.data;
                    }
                })
            },
            initAnnualLeave() {
                let param = {};
                param.holidayType = 2;
                this.annualLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.annualLeaveLoading = false;
                        this.annualLeave = resp.data;
                    }
                })
            },
            initBreastfeedingLeave() {
                let param = {};
                param.holidayType = 3;
                this.breastfeedingLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.breastfeedingLeaveLoading = false;
                        this.breastfeedingLeave = resp.data;
                    }
                })
            },
            initMarriageHoliday() {
                let param = {};
                param.holidayType = 4;
                this.marriageHolidayLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.marriageHolidayLoading = false;
                        this.marriageHoliday = resp.data;
                    }
                })
            },
            initFuneralLeave() {
                let param = {};
                param.holidayType = 5;
                this.funeralLeaveLoading = true;
                postRequest("/staff/myHoliday/getMyHolidays", param).then(resp => {
                    if (resp) {
                        this.funeralLeaveLoading = false;
                        this.funeralLeave = resp.data;
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .el-card /deep/ .el-card__header {
        background-color: #D1EEEE;
    }
</style>
