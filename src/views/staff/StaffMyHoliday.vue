<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="我的申请" name="first"><MyHolidayAppliedComponent/></el-tab-pane>
        <el-tab-pane label="今年假期" name="second"><StaffMyHolidayComponent/></el-tab-pane>
    </el-tabs>
</template>

<script>
    import StaffMyHolidayComponent from "../../components/staff/StaffMyHolidayComponent";
    import MyHolidayAppliedComponent from "../../components/staff/MyHolidayAppliedComponent";

    export default {
        name: "StaffMyHoliday",
        components:{
            StaffMyHolidayComponent:StaffMyHolidayComponent,
            MyHolidayAppliedComponent:MyHolidayAppliedComponent
        },
        data() {
            return {
                activeName: 'first'
            };
        },
    }
</script>

<style scoped>

</style>
