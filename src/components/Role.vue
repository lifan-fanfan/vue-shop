<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table :data="roleInfo" border style="width: 100%">
        <el-table-column type="expand" width="70">
          <template slot-scope="info">
            <!-- {{info.row}} -->
            <!-- 一级权限遍历 -->
            <el-row
              v-for="(item,i) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #eee','border-top':i===0?'1px solid #eee':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="closeTag(info.row.id,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限遍历 -->
                <el-row
                  v-for="(item2,k) in item.children"
                  :key="item2.id"
                  :style="{'border-top':'1px solid #eee','border-top':k!==0?'1px solid #eee':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(info.row.id,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限遍历 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="closeTag(info.row.id,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="roleName" label="名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="270"></el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(info.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showDistributeDialogVisible(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="120px">
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog title="角色分配" :visible.sync="distributeDialogVisible" width="50%">
        <el-form :model="distributeForm" label-width="130px">
          <el-form-item label="角色名称：">{{distributeForm.roleName}}</el-form-item>
          <el-form-item label="供分配权限：">
            <el-tree
              :data="rightsInfo"
              :props="rightsInfoProps"
              node-key="id"
              show-checkbox
              :default-checked-keys="defaultCheckedKeys"
              default-expand-all
              ref="rightsTree"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="distributeRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleInfo()
  },
  data() {
    return {
      roleInfo: [],
      // 添加角色数据
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      distributeForm: {
        roleName: '',
        id: 0
      },
      distributeDialogVisible: false,
      rightsInfo: [],
      rightsInfoProps: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckedKeys: []
    }
  },
  methods: {
    async getRoleInfo() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleInfo = res.data
      // console.log(this.roleInfo)
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        const { data: res } = await this.$http.post('/roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getRoleInfo()
      })
    },
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 删除权限
    async deleteRole(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getRoleInfo()
        })
        .catch(() => {})
    },
    // 删除权限
    closeTag(roleId, rightsId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete(
            `roles/${roleId}/rights/${rightsId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getRoleInfo()
        })
        .catch(() => {})
    },
    async showDistributeDialogVisible(role) {
      this.distributeDialogVisible = true
      this.distributeForm = role
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsInfo = res.data
      var idArr = []
      this.getHavaRights(role, idArr)
      this.defaultCheckedKeys = idArr
    },
    getHavaRights(roid, idArr) {
      if (!roid.children) {
        return idArr.push(roid.id)
      }
      roid.children.forEach(item => {
        return this.getHavaRights(item, idArr)
      })
    },
    async distributeRights() {
      var ids1 = this.$refs.rightsTree.getCheckedKeys()
      var ids2 = this.$refs.rightsTree.getHalfCheckedKeys()
      var allIds = [...ids1, ...ids2].join(',')
      console.log(allIds)
      if (!allIds) {
        return this.$message.error('请选择权限')
      }
      const { data: res } = await this.$http.post(
        `roles/${this.distributeForm.id}/rights`,
        { rids: allIds }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.distributeDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRoleInfo()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
