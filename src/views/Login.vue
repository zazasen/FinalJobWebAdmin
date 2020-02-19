<template>
    <div>
        <el-card class="box-card"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
            <div slot="header" class="loginTitle">
                <span>登录到人事系统</span>
            </div>
            <div style="text-align: center">
                <el-avatar :size="70" :src="circleUrl"></el-avatar>
            </div>
            <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="loginClass">
                    <el-form-item prop="username" size="small">
                        <span style="color: gray;font-size: 12px;">用户名</span>
                        <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                            <i slot="prefix" class="el-icon-user"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" size="small">
                        <span style="color: gray;font-size: 12px;">密码</span>
                        <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"
                                  @keydown.enter.native="submitForm('ruleForm')">
                            <i slot="prefix" class="el-icon-lock"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" class="loginButton">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="checked" name="remember-me" value="checked">记住我</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

    </div>
</template>

<script>
    import {postKeyValueRequest} from "../utils/RequestUtil";

    export default {
        name: "Login",
        data() {
            return {
                ruleForm: {
                    username: '',
                    password: '',
                },
                circleUrl: 'https://cn.neworld.date/theme/material/images/users/avatar-001.jpg',
                checked: false,
                loading:false,
                rules: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                }
            };
        },
        mounted() {
            this.getCookie();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        postKeyValueRequest("/doLogin", this.ruleForm, this.checked).then(resp => {
                            if (resp) {
                                this.loading = false;
                                let face = resp.data.userFace;
                                window.sessionStorage.setItem("currentUser", JSON.stringify(resp.data));
                                if (this.checked == true) {
                                    this.setCookie(this.ruleForm.username, this.ruleForm.password, face, 7);
                                } else {
                                    this.clearCookie();
                                }
                                let path = this.$route.query.redirece;
                                if (path == "/" || path == undefined) {
                                    this.$router.replace("/home");
                                } else {
                                    this.$router.replace(path);
                                }
                            }
                        });
                    } else {
                        this.$message.error("请输入用户名与密码");
                        return false;
                    }
                });
            },
            setCookie(username, password, userFace, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "username" + "=" + username + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "password" + "=" + password + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userFace" + "=" + userFace + ";path=/;expires=" + exdate.toGMTString();
            },
            getCookie: function () {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'username') {
                            //  console.log(arr2[1])
                            this.ruleForm.username = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == 'password') {
                            // console.log(arr2[1])
                            this.ruleForm.password = arr2[1];
                        } else if (arr2[0] == 'userFace') {
                            let face = "";
                            for (let j = 1; j < arr2.length; j++) {
                                face += arr2[j]+"=";
                            }
                            face = face.substring(0, face.length - 1);
                            this.circleUrl = face;
                        }
                    }
                    this.checked = true;
                }
            },
            //清除cookie
            clearCookie: function () {
                this.setCookie("", "", "", -1); //修改2值都为空，天数为负1天就好了
            }
        }
    }
</script>

<style>
    .box-card {
        width: 350px;
        margin: 150px auto;
    }

    .loginClass {
        width: 250px;
        margin: auto auto;
    }

    .loginButton {
        width: 100%;
        margin-top: 10px;
    }

    .loginTitle {
        text-align: center;
        font-size: 18px;
        color: gray;
    }
</style>
