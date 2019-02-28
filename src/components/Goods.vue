<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="50">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            class="input-with-select"
            :clearable="true"
            @clear="getGoodsList"
            @keyup.enter.native="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="GoodsList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="75"></el-table-column>
        <el-table-column label="商品名称">
          <span slot-scope="info">{{info.row.goods_name}}</span>
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="80"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.add_time | sjFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="queryParams.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
    </el-card>
  </div>
</template>


<script>
export default {
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      addDialogVisible: false,
      GoodsList: []
    }
  },
  methods: {
    // 分页功能
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.GoodsList = res.data.goods
      this.queryParams.total = res.data.total
    },
    goAddGoodsPage() {
      this.$router.push('/goodsadd')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
