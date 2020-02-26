<template>
    <div style="display: flex;justify-content: space-between">
        <AttendanceCalendar></AttendanceCalendar>
    </div>
</template>

<script>
    import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";

    export default {
        name: "AttendanceSignManager",
        components: {
            'AttendanceCalendar': AttendanceCalendar
        },
    }
</script>

<style>

</style>
