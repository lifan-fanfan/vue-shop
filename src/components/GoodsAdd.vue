<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="activeStep-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="120px">
        <el-tabs
          v-model="activeStep"
          @tab-click="handleClick"
          tab-position="left"
          :before-leave="tabBeforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" min="0" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input type="number" min="0" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" min="0" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <span>选择商品分类：</span>
            <el-cascader
              expand-trigger="hover"
              :options="catInfo"
              :props="catInfoProps"
              v-model="selectedCat"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="uploadParams"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
          </el-tab-pane>
          <el-row>
            <el-col :span="21"></el-col>
            <el-col :span="3">
              <el-button type="primary" v-if="this.activeStep < 4" @click="next">下一步</el-button>
              <el-button type="primary" v-else @click="addGoods">添加商品</el-button>
            </el-col>
          </el-row>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  created() {
    this.getcatInfo()
  },
  components: {
    quillEditor
  },
  data() {
    return {
      activeStep: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        pics: [],
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      catInfo: [],
      selectedCat: [],
      catInfoProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      threeId: 0,
      uploadUrl: 'http://127.0.0.1:8765/api/private/v1/upload',
      uploadParams: {
        Authorization: window.sessionStorage.getItem('token')
      }
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
    handleClick() {},
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
      }
    },
    next() {
      if (this.threeId === 0) {
        return this.$message.error('请选择第三级商品分类')
      }
      let addForm =
        this.addForm.goods_name.trim().length === 0 ||
        this.addForm.goods_price.trim().length === 0 ||
        this.addForm.goods_weight.trim().length === 0 ||
        this.addForm.goods_number.trim().length === 0
      if (addForm) {
        return this.$message.error('信息填写不完整')
      }
      this.activeStep++
      this.activeStep = this.activeStep + ''
    },
    tabBeforeLeave(newTab, oldTab) {
      if (newTab === '0') {
        return
      }
      let addForm =
        this.addForm.goods_name.trim().length === 0 ||
        this.addForm.goods_price.trim().length === 0 ||
        this.addForm.goods_weight.trim().length === 0 ||
        this.addForm.goods_number.trim().length === 0
      if (this.threeId === 0) {
        this.$message.error('请选择第三级商品分类')
        return false
      }
      if (addForm && newTab === '1') {
        this.$message.error('信息填写不完整')
        return false
      }
    },
    uploadSuccess(result) {
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      let obj = { pic: result.data.tmp_path }
      this.addForm.pics.push(obj)
    },
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        this.addForm.goods_cat = this.selectedCat.join(',')
        const { data: res } = await this.$http.post('goods', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 30px;
}
.el-button {
  margin-top: 20px;
}
</style>
