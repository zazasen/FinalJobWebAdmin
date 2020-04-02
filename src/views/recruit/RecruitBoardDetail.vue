<!--招聘看板详情-->
<template>
    <el-container>
        <el-header style="margin-top: 30px;height: 50px;text-align: center;font-size: 25px;font-family: 华文楷体">招聘需求
        </el-header>
        <el-main style="background-color:#F0F0F0">
            <el-card shadow="never" style="width: 95%;margin: 0 auto">
                <div style="width: 80%;margin: 0 auto">
                    <div>
                        <div style="background-color: #EBEBEB;height: 35px;line-height: 35px">
                            <span style="margin-right: 10px;margin-left: 5px">|</span><span
                                style="font-size: 13px">需求信息</span>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 82px;font-size: 12px;">申请人</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.realName}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">申请部门</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.departmentName}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">申请时间</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.applyDate}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">岗位地址</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.address}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">招聘岗位</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.positionName}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">到岗日期</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.entryDate}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">招聘人数</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.needNumber}}人</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">招聘理由</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.reasonStr}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <span style="margin-right: 70px;font-size: 12px">岗位职责</span>
                            <span v-html="data.responsibility" style="padding-bottom:5px; border-bottom:1px solid gray;width: 1100px;display: block;"></span>
                        </div>
                    </div>
                    <div style="margin-top: 50px">
                        <div style="background-color: #EBEBEB;height: 35px;line-height: 35px">
                            <span style="margin-right: 10px;margin-left: 5px">|</span><span
                                style="font-size: 13px">资格要求</span>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 95px;font-size: 12px">学历</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.degreeStr}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">年龄下限</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.minimumAge}}岁</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">年龄上限</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.highestAge}}岁</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">婚姻状况</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.wedlockStr}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 95px;font-size: 12px">性别</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.genderStr}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">专业限制</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.speciality}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">外语要求</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.foreignLanguages}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">工作经历</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.experience}}</span>
                            </div>
                        </div>
                        <div style="margin-top: 20px;display: flex;justify-content: space-between">
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 20px;font-size: 12px">需要技能（证书）</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.skill}}</span>
                            </div>
                            <div style="display: flex;justify-content: space-between">
                                <span style="margin-right: 70px;font-size: 12px">试用期</span>
                                <span style="padding-bottom:5px; border-bottom:1px solid gray;width: 400px;display: block;">{{data.probationPeriod}}个月</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "RecruitBoardDetail",
        data() {
            return {
                id: null,
                data: {},
            }
        },
        mounted() {
            this.id = window.sessionStorage.getItem("recruitBoardDetailId");
            this.initData();
        },
        methods: {
            initData() {
                let params = {};
                params.id = this.id;
                postRequest("/recruit/board/getStaffNeedsDetail", params).then(resp => {
                    if (resp) {
                        this.data = resp.data;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
