<template>
    <div>
        <el-table :data="myApprovals" border style="width: 850px"
                  v-loading="loading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column prop="produceUserName" label="申请人" width="250" align="center"/>
            <el-table-column prop="approvalTypeStr" label="申请类型" width="250" align="center"/>
            <el-table-column prop="recordStatusStr" label="审批状态" width="250" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.recordStatusStr === '待审批' ? 'primary' : 'success'"
                            disable-transitions>{{scope.row.recordStatusStr}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="lookDetail(scope.row)" type="text">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="width: 850px">
            <el-pagination @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[10, 15, 20, 50]"
                           :page-size="pageSize"
                           layout="sizes, prev, pager, next, jumper, ->, total"
                           :total=total style="margin-top: 20px">
            </el-pagination>
        </div>

        <el-dialog title="审批详细信息" :visible.sync="dialogVisible" width="30%">
            <div v-for="(index,item) in detailRecord" :key="index">
                <span style="margin-right: 10px">{{item + ':'}}</span>
                <span>{{detailRecord[item]}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="pass" size="small">审 批</el-button>
                <el-button type="danger" @click="dialogVisible = false" size="small">驳 回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "StaffMyApproval",
        data() {
            return {
                pageSize: 10,
                pageIndex: 1,
                total: null,
                loading: false,
                myApprovals: null,
                dialogVisible: false,
                detailRecord: {},
                editParam: {
                    id: ""
                }
            }
        },
        mounted() {
            this.initMyApprovals();
        },
        methods: {
            pass() {
                postRequest("/staff/myApproval/approvalPass", this.editParam).then(resp => {
                    if (resp) {
                        this.initMyApprovals();
                        this.dialogVisible = false;
                    }
                });
            },
            lookDetail(row) {
                // 初始化数据
                let param = {};
                param.id = row.id;
                this.editParam.id = row.id;
                postRequest("/staff/myApproval/getApprovalDetail", param).then(resp => {
                    if (resp) {
                        this.detailRecord = resp.data;
                        this.dialogVisible = true;
                    }
                });
            },
            sizeChange(val) {
                this.pageSize = val;
                this.initMyApprovals();
            },
            currentChange(val) {
                this.pageIndex = val;
                this.initMyApprovals();
            },
            initMyApprovals() {
                this.loading = true;
                let params = {};
                params.pageIndex = this.pageIndex;
                params.pageSize = this.pageSize;
                postRequest("/staff/myApproval/getAllMyApproval", params).then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.myApprovals = resp.data;
                        this.total = resp.total;
                    }
                })
            }
        }
    }
</script>

<style>

</style>
