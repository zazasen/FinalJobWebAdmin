<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="考勤日历" name="first">
                <AttendanceCalendar/>
            </el-tab-pane>
            <el-tab-pane label="考勤记录" name="second">
                <AttendanceRecord/>
            </el-tab-pane>
            <el-tab-pane label="考勤统计" name="third">
                <AttendanceStatistics/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import AttendanceCalendar from "../../components/staff/AttendanceCalendar";
    import AttendanceRecord from "../../components/staff/AttendanceRecord";
    import AttendanceStatistics from "../../components/staff/AttendanceStatistics";

    export default {
        name: "StaffMyAttendance",
        data() {
            return {
                activeName: 'third'
            };
        },
        components: {
            'AttendanceCalendar': AttendanceCalendar,
            'AttendanceRecord': AttendanceRecord,
            'AttendanceStatistics': AttendanceStatistics,
        }
    }
</script>

<style scoped>

</style>
