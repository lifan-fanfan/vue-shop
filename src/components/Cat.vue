<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <zk-table
        :data="catInfo"
        :columns="catInfoColumns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
      >
        <template slot="order" slot-scope="info">
          <el-tag v-if="info.row.cat_level===0">一级分类</el-tag>
          <el-tag type="success" v-else-if="info.row.cat_level===1">二级分类</el-tag>
          <el-tag type="warning" v-else>三级分类</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
      <!-- 添加分类 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCatFormClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <el-cascader
              expand-trigger="hover"
              :options="catInfoCascader"
              :props="catInfoProps"
              v-model="selectedCat"
              @change="handleChange"
              change-on-select
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCat">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatInfo()
  },
  data() {
    return {
      // 加载列表数据
      catInfo: [],
      catInfoColumns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      queryParams: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      // 添加分类数据
      addDialogVisible: false,
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      catInfoCascader: [],
      selectedCat: [],
      catInfoProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  methods: {
    // 分页功能
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getCatInfo()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getCatInfo()
    },
    // 加载列表
    async getCatInfo() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum: this.queryParams.pagenum,
          pagesize: this.queryParams.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catInfo = res.data.result
      this.queryParams.total = res.data.total
    },
    // 添加分类
    async showAddDialog() {
      this.addDialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      this.catInfoCascader = res.data
    },
    addCatFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    handleChange() {
      if (this.selectedCat.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        let len = this.selectedCat.length
        this.addForm.cat_pid = this.selectedCat[len - 1]
        this.addForm.cat_level = len
      }
    },
    async addCat() {
      this.$refs.addFormRef.validate(async valid => {
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.addDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getCatInfo()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
