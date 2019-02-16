<template>
  <div>
    <h2>用户管理界面</h2>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card"></el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    return {
      userList: []
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: {
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status === 200) {
        this.userList = res.data.users
        console.log(res)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
