<template>
    <div>
        <div>
            <el-table :data="depData" border stripe style="width: 80%;margin-top: 10px"
                      :default-expand-all="true"
                      row-key="id" :expand-row-keys="['1']"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="name" label="部门名"/>
                <el-table-column prop="approvalFlowVo.firstApprovalManName" label="第一审批人"/>
                <el-table-column prop="approvalFlowVo.secondApprovalManName" label="第二审批人"/>
                <el-table-column prop="approvalFlowVo.thirdApprovalManName" label="第三审批人"/>
                <el-table-column label="审批流设置">
                    <template slot-scope="scope">
                        <el-button type="text" @click="flowButton(scope.row)">审批流设置</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="审批流管理" :visible.sync="dialogVisible" width="30%">
            <div>
                <label><span style="color: red;margin-right: 5px">*</span>第一审批人</label>
                <el-select v-model="approvalFlowData.firstApprovalMan" placeholder="请选择"
                           style="width: 250px;margin-left: 10px;margin-top: 10px">
                    <el-option v-for="(item,index) in depStaff" :key="index" :label="item.realName"
                               :value="item.id"/>
                </el-select>
            </div>
            <div>
                <label><span style="color: red;margin-right: 5px">*</span>第二审批人</label>
                <el-select v-model="approvalFlowData.secondApprovalMan" placeholder="请选择"
                           style="width: 250px;margin-left: 10px;margin-top: 10px">
                    <el-option v-for="(item,index) in depStaff" :key="index" :label="item.realName"
                               :value="item.id"/>
                </el-select>
            </div>
            <div>
                <label><span style="color: red;margin-right: 5px">*</span>第三审批人</label>
                <el-select v-model="approvalFlowData.thirdApprovalMan" placeholder="请选择"
                           style="width: 250px;margin-left: 10px;margin-top: 10px">
                    <el-option v-for="(item,index) in depStaff" :key="index" :label="item.realName"
                               :value="item.id"/>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="defineChange">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {postRequest} from "../../utils/RequestUtil";

    export default {
        name: "BpFlowManager",
        data() {
            return {
                active: 0,
                depData: [],
                depStaff: [],
                loading: false,
                dialogVisible: false,
                approvalFlowData: {
                    departmentId: "",
                    firstApprovalMan: "",
                    secondApprovalMan: "",
                    thirdApprovalMan: ""
                }
            }
        },
        mounted() {
            this.getDepTree();
        },
        methods: {
            defineChange() {
                postRequest("/bp/flow/changeApprovalFlow", this.approvalFlowData);
                this.dialogVisible = false;
            },
            flowButton(data) {
                this.approvalFlowData = {};
                this.dialogVisible = true;
                let params = {};
                params.id = data.parentId;
                postRequest("/bp/flow/getBrotherAndFatherDepStaff", params).then(resp => {
                    if (resp) {
                        this.approvalFlowData.departmentId = data.id;
                        this.depStaff = resp.data;
                    }
                })
            },
            getDepTree() {
                this.loading = true;
                postRequest("/bp/flow/getDepByBp").then(resp => {
                    if (resp) {
                        this.loading = false;
                        this.depData = resp.data;
                    }
                })
            }
        }
    }
</script>

<style>

</style>
