<template>
  <div id="login-container">
    <!-- <h2>用户登录</h2> -->
    <div id="login-box">
      <div id="login-logo">
        <img src="../assets/images/logo.png" alt>
      </div>
      <el-form ref="LoginformRef" :model="Loginfrom" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="Loginfrom.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="Loginfrom.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Loginfrom: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.LoginformRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/login', this.Loginfrom)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或者密码错误')
          }
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
    reset() {
      this.$refs.LoginformRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background: #2b4b6b;
  overflow: hidden;
  height: 100%;
  position: relative;
  #login-box {
    width: 450px;
    height: 304px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #login-logo {
      width: 148px;
      height: 148px;
      border-radius: 50%;
      padding: 8px;
      background: #fff;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .el-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
