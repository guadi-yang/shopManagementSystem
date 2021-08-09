<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮 -->
          <el-button @click="addRoles" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table
      :data="rolesTableData"
      stripe
      border>
      <el-table-column type="expand" label="">
        <template slot-scope="scope">
          <el-row v-for="(item,index) in scope.row.children" :class="['bdbottom',index==0 ? 'bdtop' :'','vcenter']" :key="item.id">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag @close="removeRightById(scope.row,item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级权限和三级权限 -->
            <el-col :span="19">
              <el-row :class="[index1==0?'':'bdtop','vcenter']" v-for="(item1,index1) in item.children" :key="item1.id">
                <el-col :span="6">
                  <el-tag @close="removeRightById(scope.row,item1.id)" closable type="success">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag @close="removeRightById(scope.row,item2.id)" closable type="warning" v-for="item2 in item1.children" :key="item2.id">{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述">
      </el-table-column>
      <el-table-column label="操作" width="340px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="rolesEditClick(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="rolesDeleteClick(scope.row)">删除</el-button>
          <el-button type="warning" icon="el-icon-star-on" @click="distributePower(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <el-dialog
    title="添加角色"
    :visible.sync="addRolesVisible"
    width="50%">
  <el-form ref="rolesFormRef" :rules="rolesRules" :model="rolesForm" label-width="80px">
    <el-form-item prop="roleName" label="角色名称">
      <el-input v-model="rolesForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input v-model="rolesForm.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRolesClick">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="distributeVisible"
      width="50%">
      <el-tree ref="treeRef" show-checkbox node-key="id" :default-checked-keys="defKeys" default-expand-all :data="rightsList" :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
  title="修改角色"
  :visible.sync="editRolesVisible"
  width="50%">
  <el-form ref="editRolesform" :model="editForm" label-width="80px">
    <el-form-item label="角色名称">
      <el-input v-model="editForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input v-model="editForm.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesRight">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      rolesTableData:[],
      addRolesVisible:false,
      distributeVisible:false,
      rolesForm:{
        roleName:'',
        roleDesc:''
      },
      rolesRules:{
        roleName:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      defKeys:[],
      rightsList:[],
      defaultProps:{
        label:'authName',
        children:'children'
      },
      roleId:'',
      editRolesVisible:false,
      editForm:{
        roleName:'',
        roleDesc:''
      }
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    getRolesList(){
      this.$http.get('/roles').then(res=>{
        console.log(res)
        this.rolesTableData=res.data.data
      })
    },
    addRoles(){
      this.addRolesVisible=true
    },
    addRolesClick(){
      this.$refs.rolesFormRef.validate(valid=>{
        if(!valid) return this.$message.error('填写信息错误')
        this.$http.post('/roles',this.rolesForm).then(res=>{
          console.log(res);
          if(res.data.meta.status!=201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.addRolesVisible=false
          this.getRolesList()
        })
      })
    },
    removeRightById(role,id){
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/roles/${role.id}/rights/${id}`).then(res=>{
            console.log(role.children)
            console.log(res.data.data)
            if(res.data.meta.status!=200) return this.$message.error('取消权限失败')
            this.$message.success('取消权限成功')
            role.children=res.data.data
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    distributePower(row){
      this.$http.get('/rights/tree').then(res=>{
        //console.log(row)
        this.roleId=row.id
        this.rightsList=res.data.data
        this.defKeys=[]
        for(let i=0;i<row.children.length;i++){
          for(let j=0;j<row.children[i].children.length;j++){
            for(let k=0;k<row.children[i].children[j].children.length;k++){
              this.defKeys.push(row.children[i].children[j].children[k].id)
            }
          }
        }
        console.log(this.defKeys);
      })
      this.distributeVisible=true
    },
    // getLeafKeys(node,arr){
    //   if(!node.children){
    //     return arr.push(node.id)
    //   }
    //   node.children.forEach(element => this.getLeafKeys(element,arr));
    // }
    allotRoles(){
      let rid = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      rid=rid.join(',')
      this.$http.post('roles/'+ this.roleId +'/rights',{
        rids:rid
      }).then(res=>{
        if(res.data.meta.status!=200) return this.$message.error('分配错误')
        this.$message.success('分配成功')
        this.distributeVisible=false
      })
    },
    rolesEditClick(row){
      this.editRolesVisible=true
      console.log(row);
      this.editForm.roleName=row.roleName
      this.editForm.roleDesc=row.roleDesc
      this.editForm.id=row.id
    },
    editRolesRight(){
      this.$http.put(`roles/${this.editForm.id}`,{
        roleName:this.editForm.roleName,
        roleDesc:this.editForm.roleDesc
      }).then(res=>{
        if(res.data.meta.status!=200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getRolesList()
        this.editRolesVisible=false
      })
    },
    rolesDeleteClick(row){
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.delete('roles/'+row.id).then(res=>{
            if(res.data.meta.status!=200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getRolesList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>

<style type="text/css" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top:1px solid #eee
}
.bdbottom{
  border-bottom:1px solid #eee
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
