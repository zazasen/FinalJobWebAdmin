<template>
    <el-container class="main" style="position: absolute;width:100%;height: 100%;">
        <el-header class="head" style="height: 100px;margin-top: 20px">
            <strong>某不知名公司招聘岗位</strong>
            <div>Join Us</div>
        </el-header>
        <el-main>
            <el-card style="width: 1300px;margin: 30px auto;background-color: #F2F2F2" shadow="never">
                <div slot="header">
                    <div>
                        <span style="color:#36648B;font-size: 20px;">{{detailData.positionName}}</span>
                        <span style="margin-left: 10px;color: #20B2AA">{{detailData.salaryLow}}~{{detailData.salaryTop}}</span>
                    </div>
                    <div style="margin-top: 15px">
                        <i class="el-icon-place" style="margin-right: 10px"></i>{{detailData.address}}
                        <i class="el-icon-suitcase-1" style="margin-right: 10px;margin-left: 20px"></i>{{detailData.experience}}
                        <i class="fa fa-graduation-cap" style="margin-right: 10px;margin-left: 20px"></i>{{detailData.degreeStr}}
                        <span style="float: right; padding: 3px 0">{{detailData.applyDate}}</span>
                    </div>
                </div>
                <div>
                    <div style="margin-top: 5px">性别 : {{detailData.genderStr}}</div>
                    <div style="margin-top: 5px">外语要求 : {{detailData.foreignLanguages}}</div>
                    <div style="margin-top: 5px">招聘人数 : {{detailData.needNumber}}人</div>
                    <div style="margin-top: 5px">年龄要求 : {{detailData.minimumAge}}~{{detailData.highestAge}}岁</div>
                    <div style="margin-top: 5px">到岗日期 : {{detailData.entryDate}}</div>
                    <div style="margin-top: 5px">技能要求或证书 : {{detailData.skill}}</div>
                    <div style="margin-top: 5px">
                        <div>岗位详情</div>
                        <div v-html="detailData.responsibility"></div>
                    </div>
                    <div style="text-align: center">
                        <el-button style="margin-right: 40px;margin-top: 20px;width: 300px" type="primary" round>投递</el-button>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "ShowDetail",
        data() {
            return {
                detailData: null,
            }
        },
        mounted(){
            this.initDate();
        },
        methods: {
            initDate() {
                let params = {};
                params.id = window.sessionStorage.getItem("showDetailId");
                postRequest("/home/getStaffNeedsDetail", params).then(resp => {
                    if (resp) {
                        this.detailData = resp.data;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .main {
        /*background-image: url("../../assets/imgs/1.png");*/
    }
    .head {
        font-size: 40px;
        text-align: center;
        font-family: 华文楷体;
    }
</style>
