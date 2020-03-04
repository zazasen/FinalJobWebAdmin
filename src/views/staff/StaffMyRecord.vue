<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="申请列表" name="first">
                <StaffMyRecordComponent/>
            </el-tab-pane>
            <el-tab-pane label="申请中心" name="second">
                <ApplyCenterComponent/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import StaffMyRecordComponent from "../../components/staff/StaffMyRecordComponent";
    import ApplyCenterComponent from "../../components/staff/ApplyCenterComponent";

    export default {
        name: "StaffMyRecord",
        data() {
            return {
                activeName: 'first'
            }
        },
        components: {
            StaffMyRecordComponent: StaffMyRecordComponent,
            ApplyCenterComponent: ApplyCenterComponent
        }

    }
</script>

<style scoped>

</style>
