<template>
    <div>
        <SetRewardAndPunish/>
    </div>
</template>

<script>
    import SetRewardAndPunish from "../../components/salary/SetRewardAndPunish";

    export default {
        name: "SalaryRewardAndPunish",
        data() {
            return {
                activeName: 'first'
            }
        },
        components:{
            SetRewardAndPunish:SetRewardAndPunish,
        }
    }
</script>

<style scoped>

</style>
