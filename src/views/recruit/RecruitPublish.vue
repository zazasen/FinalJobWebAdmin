<!--所有发布岗位列表页面-->
<template>
    <el-container class="main" style="position: absolute;width:100%;height: 100%;">
        <el-header class="head" style="height: 100px;margin-top: 20px">
            <div><strong>某不知名公司招聘岗位</strong></div>
            <div>Join Us</div>
        </el-header>
        <el-main>
            <div style="width: 1200px;margin: 0 auto">
                <el-card shadow="hover" v-for="(item,index) in staffNeedsDate" :key="index">
                    <div slot="header">
                        <el-button style="float: right; padding: 3px 0" type="text" @click="detail(item.id)">查看详情</el-button>
                        <div>
                            <span style="color:#36648B;font-size: 20px;"><strong>{{item.positionName}}</strong></span>
                        </div>
                        <div style="margin-top: 15px">
                            <i class="el-icon-place" style="margin-right: 10px"></i>{{item.address}}
                            <i class="el-icon-suitcase-1" style="margin-right: 10px;margin-left: 20px"></i>{{item.experience}}
                            <span style="float: right; padding: 3px 0">{{item.applyDate}}</span>
                        </div>
                    </div>
                    <div v-html="item.responsibility"></div>
                </el-card>
                <el-pagination @size-change="sizeChange"
                               @current-change="currentChange"
                               :page-sizes="[10, 15, 20, 50]"
                               :page-size="queryForm.pageSize"
                               layout="sizes, prev, pager, next, jumper, ->, total"
                               :total=total style="margin-top: 20px">
                </el-pagination>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "RecruitPublish",
        data() {
            return {
                staffNeedsDate: null,
                queryForm: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                total: null,
            }
        },
        mounted() {
            this.initDate();
        },
        methods: {
            detail(val) {
                window.sessionStorage.setItem("showDetailId", val);
                let routeUrl = this.$router.resolve({path: "/showDetail"});
                window.open(routeUrl.href, '_blank');
            },
            initDate() {
                postRequest("/home/getPublishedStaffNeeds", this.queryForm).then(resp => {
                    if (resp) {
                        this.staffNeedsDate = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            sizeChange(val) {
                this.queryForm.pageSize = val;
            },
            currentChange(val) {
                this.queryForm.pageIndex = val;
            },
        }
    }
</script>

<style scoped>
    .head {
        font-size: 40px;
        text-align: center;
        font-family: 华文楷体;
    }

    .main {
        background-image: url("../../assets/imgs/1.png");
    }
</style>
