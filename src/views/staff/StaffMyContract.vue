<template>
    <div>
        <el-table :data="contractData" style="width: 100%;margin-top: 10px" border stripe
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  v-loading="loading" size="small"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column prop="beginContractTime" label="合同开始日期" align="center"/>
            <el-table-column prop="endContractTime" label="合同结束日期" align="center"/>
            <el-table-column prop="confirm" label="签署状态" align="center">
                <template slot-scope="scope">
                    <el-tag :type="getType(scope.row)" disable-transitions>{{scope.row.confirmStr}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="getContract(scope.row)">查看合同</el-button>
                    <el-button type="text" size="small" @click="define()">确定签约</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/RequestUtil";

    export default {
        name: "StaffMyContract",
        data() {
            return {
                contractData: null,
                loading: false,
            }
        },
        mounted() {
            this.initMyContract();
        },
        methods: {
            define() {
                this.$confirm('确定好合同了吗，有问题及时联系 hr 哦', {
                    confirmButtonText: '好了',
                    cancelButtonText: '再看看',
                    type: 'warning'
                }).then(() => {
                    postRequest("/staff/myContract/confirmAdd").then(resp => {
                        if (resp) {
                            this.initMyContract();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '那就再看看吧'
                    });
                });
            },
            getType(row) {
                if (row.signState === '待签署') {
                    return 'primary';
                } else if (row.signState === '已签署') {
                    return 'success';
                } else {
                    return 'danger';
                }
            },
            initMyContract() {
                this.loading = true;
                postRequest("/staff/myContract/getMyContract").then(resp => {
                    if (resp) {
                        this.contractData = resp.data;
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                })
            },
            getContract() {
                window.open("/staff/myContract/getContract");
            }
        }
    }
</script>

<style scoped>

</style>
