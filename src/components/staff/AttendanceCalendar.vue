<template>
    <div>
        <el-calendar>
            <template slot="dateCell" slot-scope="{date, data}">
                <div>{{ data.day.split('-').slice(2).join('-') }}</div>
                <div>
                    {{handleSelected(data.day)}}
                </div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
    import {getRequest} from "../../utils/RequestUtil";

    export default {
        name: "AttendanceCalendar",
        data() {
            return {
                calendarData: []
            };
        },
        mounted() {
            this.initCalendar();
        },
        methods: {
            initCalendar() {
                getRequest("/system/config/calendarShow").then(resp => {
                    if (resp) {
                        this.calendarData = resp.data;
                    }
                })
            },
            handleSelected(day) {
                for (let i = 0; i < this.calendarData.length; i++) {
                    if (this.calendarData[i].date == day) {
                        return this.calendarData[i].status;
                    }
                }
                return "";
            }
        }
    }
</script>

<style>

</style>
