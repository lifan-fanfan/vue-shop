<template>
  <el-container>
    <el-header>
      <div id="logo_box">
        <img src="../assets/images/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow?'65px':'200px'">
        <div class="switch" @click="menushow=!menushow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="menushow"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu
            v-for="(item,i) in menuList"
            :key="item.id"
            :index="item.id + ''"
            :style="menushow?'width:65px;':'width:200px;'"
          >
            <template slot="title">
              <i :class="'iconfont icon-' + menuIcon[i]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item2.path">
                <i class="el-icon-menu"></i>
                {{item.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      menuList: [],
      menuIcon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    logout() {
      this.$confirm('确定退出账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
        // console.log(res.data)
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    padding: 0 20px 0 10px;
    background: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    #logo_box {
      display: flex;
      align-items: center;
      font-size: 22px;
      color: #fff;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    user-select: none;
    background: #333744;
    .switch {
      height: 25px;
      line-height: 25px;
      color: #fff;
      text-align: center;
      font-size: 12px;
      background: #4a5064;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background: #eaedf1;
  }
}
</style>
