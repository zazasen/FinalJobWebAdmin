<template>
    <el-container style="background-color:#F0F0F0">
        <el-header style="height: 20px;margin-top: 20px">基本信息</el-header>
        <el-main>
            <el-card style="width: 99%;margin: 0 auto">
                <div slot="header">
                    <span>{{user.realName}}</span>
                </div>
                <div>
                    <div style="float: left">
                        <el-upload action="/system/config/updateUserFace"
                                   :show-file-list="false"
                                   :data="user"
                                   :on-success="onSuccess"
                                   :before-upload="beforeAvatarUpload">
                            <img title="点击修改用户头像" :src="user.userFace"
                                 style="width: 100px;height: 100px;border-radius: 100px;">
                        </el-upload>
                    </div>
                    <div style="float: left;margin-left: 100px">
                        <div><b>基本信息</b></div>
                        <div style="margin-top: 20px;font-size: 14px;margin-bottom: 20px">
                            <div>
                                <span style="margin-right: 50px">登录账号</span>
                                <span>{{user.username}}</span>
                            </div>
                            <div style="margin-top: 10px">
                                <span style="margin-right: 50px">登录密码</span>
                                <span style="margin-right: 50px">********</span>
                                <el-button type="text" size="small" @click="changePassword">修改</el-button>
                            </div>
                            <div style="margin-top: 10px">
                                <span style="margin-right: 50px">所属部门</span>
                                <span style="margin-right: 50px">{{user.departmentName}}</span>
                            </div>
                            <div style="margin-top: 10px">
                                <span style="margin-right: 50px;margin-left: 28px">职位</span>
                                <span style="margin-right: 50px">{{user.positionName}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </el-main>
        <el-dialog title="修改登录密码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input v-model="ruleForm.oldPassword" style="width: 200px" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="ruleForm.newPassword" style="width: 200px" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="ruleForm.confirmPassword" style="width: 200px" show-password></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')" size="small">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {postRequest} from "../utils/RequestUtil";

    export default {
        name: "MyInfo",
        data() {
            return {
                user: null,
                dialogVisible:false,
                ruleForm:{
                    userId:'',
                    oldPassword:'',
                    newPassword:'',
                    confirmPassword:'',
                },
                rules: {
                    oldPassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                    ],
                    confirmPassword: [
                        { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    ],
                }
            }
        },
        mounted() {
            this.getUserInfo();
        },
        methods: {
            handleClose(done) {
                done();
                this.$refs['ruleForm'].resetFields();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.newPassword != this.ruleForm.confirmPassword) {
                            this.$message.warning('两次密码不同');
                        } else {
                            postRequest("/system/config/updatePassword",this.ruleForm).then(resp=>{
                                if(resp){
                                    this.dialogVisible = false;
                                }
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            getUserInfo() {
                let params = {};
                params.userId = JSON.parse(window.sessionStorage.getItem("currentUser")).id;
                postRequest("/system/config/getMyInfo", params).then(resp => {
                    if (resp) {
                        this.user = resp.data;
                    }
                })
            },
            changePassword() {
                this.ruleForm.userId = JSON.parse(window.sessionStorage.getItem("currentUser")).id;
                this.dialogVisible = true;
            },
            onSuccess(res, file) {
                window.sessionStorage.setItem("currentUser", JSON.stringify(this.user));
                this.getUserInfo();
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style scoped>

</style>
