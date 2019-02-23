<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            :options="catInfo"
            :props="catInfoProps"
            v-model="selectedCat"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="showButton">添加参数</el-button>
          <el-table :data="manyInfo" border style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="序号" width="75"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="300">
              <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="showButton">添加属性</el-button>
          <el-table :data="onlyInfo" border style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="序号" width="75"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="300">
              <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getcatInfo()
  },
  data() {
    return {
      catInfo: [],
      selectedCat: [],
      catInfoProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      showButton: true,
      activeName: 'many',
      manyInfo: [],
      onlyInfo: [],
      threeId: 0
    }
  },
  methods: {
    async getcatInfo() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catInfo = res.data
    },
    handleChange() {
      if (this.selectedCat.length !== 3) {
        this.selectedCat = []
        this.threeId = 0
        this.manyInfo = []
        this.onlyInfo = []
        this.showButton = true
      } else {
        this.showButton = false
        this.threeId = this.selectedCat[2]
        this.getParamsInfo()
      }
    },
    // 选取tab切换触发
    handleClick() {
      if (this.threeId === 0) {
        return null
      }
      this.getParamsInfo()
    },
    // 加载参数列表
    async getParamsInfo() {
      const { data: res } = await this.$http.get(
        `categories/${this.threeId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      if (this.activeName === 'many') {
        this.manyInfo = res.data
      } else {
        this.onlyInfo = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 10px;
}
</style>
