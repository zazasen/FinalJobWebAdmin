<!--投递简历页面-->
<template>
    <el-container class="main" style="position: absolute;width:100%;height: 100%;">
        <el-header class="head" style="height: 100px;margin-top: 30px">
            <img style="width: 230px;height: 100px" src="http://e8.weaver.com.cn/plugin/resource/zpgl/joinus.png">
        </el-header>
        <el-main>
            <div style="width: 700px;margin: 0 auto">
                <el-form :model="inputMessage" :rules="rules" ref="ruleForm" label-width="100px" s>
                    <el-form-item label="姓名" prop="name">
                        <el-input placeholder="请输入..." v-model="inputMessage.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input placeholder="请输入..." v-model="inputMessage.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input placeholder="请输入..." v-model="inputMessage.email"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" prop="idCard">
                        <el-input placeholder="请输入..." v-model="inputMessage.idCard"></el-input>
                    </el-form-item>
                    <el-form-item label="简历文件" prop="file">
                        <el-upload drag ref="upload" :data="inputMessage" :auto-upload="false"
                                   :on-success="upFile"
                                   :on-remove="handleRemove"
                                   :on-exceed="handleExceed"
                                   :on-change="onChange"
                                   action="/home/inputResume" :limit="1">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width: 600px;" type="primary"
                                   @click="submitForm('ruleForm')">提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "InputResume",
        data() {
            return {
                fileList: [],
                inputMessage: {
                    name: '',
                    phone: '',
                    idCard: '',
                    email: '',
                    staffNeedsId: window.sessionStorage.getItem("showDetailId"),
                    file: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {
                            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                            message: '手机号格式不对',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {required: true, message: '请输入电子邮箱', trigger: 'blur'},
                        {
                            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                            message: '电子邮箱格式不对',
                            trigger: 'blur'
                        }
                    ],
                    idCard: [
                        {required: true, message: '请输入身份证号码', trigger: 'blur'},
                        {
                            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                            message: '身份证号码格式有误',
                            trigger: 'blur'
                        }
                    ],
                    file: [
                        {required: true, message: '请选择简历文件', trigger: 'blur'},
                    ],
                }
            };
        },
        methods: {
            onChange(file) {
                if (file && file.status == 'ready') {
                    this.inputMessage.file = file;
                }
            },
            upFile(res, file, fileList) {
                if (res) {
                    if (res.code == 200) {
                        this.$message.success(res.msg);
                        this.$refs.upload.clearFiles();
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Object.assign('', this.inputMessage);
                        // 表单验证通过后使用组件自带的方法触发上传事件
                        this.$refs.upload.submit();
                        this.$refs[formName].resetFields();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleExceed(files, fileList) {
                this.$message.warning(`只能选择一份简历，请先移除之前的简历再上传`);
            },
            handleRemove(res, file, fileList) {
                this.$message.warning(`移除当前${res.name}简历，请重新选择简历上传！`);
            }
        }
    }
</script>

<style scoped>
    .head {
        text-align: center;
    }

    .main {
        background-color: #FFD700;
    }
</style>
