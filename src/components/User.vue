<template>
  <div>
    <h2>用户管理界面</h2>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="50">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            class="input-with-select"
            :clearable="true"
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="75"></el-table-column>
        <el-table-column label="用户名">
          <span slot-scope="info">{{info.row.username}}</span>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="160"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="160"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="110">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="showFenpeiDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
      <!-- 添加用户弹框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户信息 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editFormClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="fenpeiDialogVisible"
        width="50%"
        @close="fenpeiFormClose"
      >
        <el-form
          :rules="fenpeiFormRules"
          ref="fenpeiFormRef"
          :model="fenpeiForm"
          label-width="100px"
        >
          <el-form-item label="当前的用户" prop="username">{{fenpeiForm.username}}</el-form-item>
          <el-form-item label="分配角色" prop="rid">
            <el-select v-model="fenpeiForm.rid" placeholder="请选择">
              <el-option
                v-for="item in roleInfo"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fenpeiDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="fenpeiRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!/1[35678]\d{9}$/.test(value)) {
        return callback(new Error('请输入正确格式的手机号'))
      }
      callback()
    }
    var checkEmail = (rule, value, callback) => {
      if (
        !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
          value
        )
      ) {
        return callback(new Error('请输入正确格式的邮箱'))
      }
      callback()
    }
    return {
      userList: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 0
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      fenpeiForm: {
        username: '',
        rid: ''
      },
      roleInfo: [],
      fenpeiDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }]
      },
      editFormRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }]
      },
      fenpeiFormRules: {
        email: [{ required: true, message: '角色必填', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 分页功能
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getUserList()
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.queryParams.total = res.data.total
      // 解决一页只有一个用户删除之后会返回空的页面
      /* if (res.data.users.length === 0 && this.queryParams.pagenum > 1) {
        this.queryParams.pagenum -= 1
        this.getUserList()
      } */
      // console.log(res.data)
    },
    async changeState(id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '状态修改失败',
          type: 'error'
        })
      }
      this.$message({
        showClose: true,
        message: '状态修改成功',
        type: 'success'
      })
    },
    // 重置add表单
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/users', this.addForm)
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserList()
        }
      })
    },
    deleteUser(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete('/users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          // 解决一页只有一个用户删除之后会返回空的页面
          if (this.userList.length === 1 && this.queryParams.pagenum > 1) {
            this.queryParams.pagenum--
          }
          this.getUserList()
        })
        .catch(() => {})
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            '/users/' + this.editForm.id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserList()
        }
      })
    },
    fenpeiFormClose() {
      this.$refs.fenpeiFormRef.resetFields()
    },
    async showFenpeiDialog(id) {
      this.fenpeiDialogVisible = true
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.fenpeiForm = res.data
      const { data: res2 } = await this.$http.get('/roles')
      if (res2.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleInfo = res2.data
    },
    async fenpeiRole(id) {
      const { data: res } = await this.$http.put(
        `users/${this.fenpeiForm.id}/role`,
        this.fenpeiForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.fenpeiDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
