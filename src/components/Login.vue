<template>
  <div id="login">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <el-form ref="loginForm" class="login-form" :rules="rules" :model="form">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form:{
        username:'admin',
        password:'123456'
      },
      rules:{
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    reset(){
      this.$refs.loginForm.resetFields()
    },
    login(){
      this.$refs.loginForm.validate(async valid=>{
        if(!valid){
          return
        }
        const {data:res} =await this.$http.post("/login",this.form)
        if(res.meta.status!==200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem("token",res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style type="text/css" lang="less"  scoped>
#login{
  height: 100%;
  background-color: #5989AF;
}
.login-box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar-box{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: -50%;
    transform: translate(-50%,80%);
    img{
      width: 100%;
      height: 100%;
      background-color: #eee;
      
    }
  }
  .btn{
    display: flex;
    justify-content: flex-end;
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 25px;
    box-sizing: border-box;
  }
}
</style>
