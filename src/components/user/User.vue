<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索添加 -->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table border stripe :data="userList">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="stateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
             <el-button type="success" size="mini" @click="modifyClick(scope.row.id)">修改</el-button>
             <el-button type="danger" size="mini" @click="deleteClick(scope.row.id)">删除</el-button>
             <el-button type="warning" size="mini" @click="distClick(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="isVisible"
    width="50%"
    @close="dialogClose">
      <el-form ref="elform" :model="addForm" :rules="rules" label-width="70px">
        <el-form-item prop="username" label="用户名">
        <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
        <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
        <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
        <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->
    <el-dialog
    title="修改用户"
    :visible.sync="modifyVisible"
    width="50%"
    @close="modifyClose">
      <el-form ref="modifyFormRef" :rules="modifyrules" :model="modifyForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled v-model="modifyForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="modifyForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="modifyForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="modifyVisible = false">取 消</el-button>
      <el-button type="primary" @click="RightClick">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="distributeUsersVisible"
      width="50%"
      @close="dialogDisClose">
      <div class="tagblock">
        <el-tag>当前用户：{{username}}</el-tag>
        <el-tag class="aaaa">当前用户：{{role_name}}</el-tag>
      </div>
      
      分配新角色:
      <el-select v-model="selectedId" placeholder="请选择">
        <el-option
        v-for="item in roleList"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeUsersVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      var checkEmail=(rule,value,callback)=>{
        const regEmail=/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if(regEmail.test(value)){
          return callback()
        }
        callback(new Error('请输入合法邮箱'))
      }

      var checkNumber=(rule,value,callback)=>{
        const regNumber=/^1\d{10}$/
        if(regNumber.test(value)){
          return callback()
        }
        callback(new Error('请输入合法手机号码'))
      }


      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        userList:[],
        total:0,
        isVisible:false,
        modifyVisible:false,
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:'',
        },
        modifyForm:{
          username:'',
          email:'',
          mobile:''
        },
        rules:{
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          { validator:checkEmail, trigger:'blur'}

        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator:checkNumber, trigger:'blur'}
        ]
       },
       modifyrules:{
         email:[
           { required: true, message: '请输入登录邮箱', trigger: 'blur' },
           { validator:checkEmail, trigger:'blur'}
         ],
         mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator:checkNumber, trigger:'blur'}
        ]
       },
       distributeUsersVisible:false,
       username:'',
       role_name:'',
       roleList:[],
       selectedId:'',
       roleidid:'',
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
      getUserList(){
        this.$http.get('users',{
          params:this.queryInfo
        }).then(res=>{
          //console.log(res)
          this.userList=res.data.data.users
          this.total=res.data.data.total
        })
      },
      handleSizeChange(size){
        this.queryInfo.pagesize=size
        this.getUserList();
      },
      handleCurrentChange(size){
        this.queryInfo.pagenum=size
        this.getUserList();
      },
      stateChange(row){
        //console.log(row.id)
        this.$http.put(`users/${row.id}/state/${row.mg_state}`).then(res=>{
          if(res.data.meta.status==200)
          this.$message.success('更新状态成功')
          //console.log(res)
        })
      },
      dialogClose(){
        this.$refs.elform.resetFields()
      },
      addClick(){
        this.$refs.elform.validate(valid=>{
          if(!valid) return 
          this.$http.post('/users',this.addForm).then(res=>{
            console.log(res)
            if(res.data.meta.status!=201) this.$message.error('添加失败')
            this.$message.success('添加成功')
            this.isVisible=false
            this.getUserList()
          })
        })
      },
      modifyClick(id){
        this.modifyVisible=true
        this.$http.get(`/users/${id}`).then(res=>{
          console.log(res);
          if(res.data.meta.status!=200) return this.$message.error('查询失败')
          this.modifyForm.username=res.data.data.username
          this.modifyForm.email=res.data.data.email
          this.modifyForm.mobile=res.data.data.mobile
          this.modifyForm.id=res.data.data.id
        })
      },
      modifyClose(){
        this.$refs.modifyFormRef.resetFields()
      },
      RightClick(){
        this.$refs.modifyFormRef.validate(valid=>{
          if(!valid) return 
          this.$http.put('/users/'+this.modifyForm.id,{
            email:this.modifyForm.email,
            mobile:this.modifyForm.mobile,
          }).then(res=>{
            console.log(res)
            if(res.data.meta.status!=200) return this.$message.error('修改失败')
            this.$message.success('修改成功')
            this.modifyVisible=false
            this.getUserList()
          })
        })
      },
      deleteClick(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',//返回'confirm'字符串
          cancelButtonText: '取消',//报错，使用catch捕获，错误为'cancel'字符串
          type: 'warning'
        }).then(()=>{
          this.$http.delete('/users/'+id).then(res=>{
            console.log(res)
            if(res.data.meta.status!=200) return this.$message.error('删除失败')
            this.$message.success('已成功删除')
            this.getUserList()
          })
        }).catch(()=>{
          this.$message.info('已取消删除')
        })
      },
      distClick(row){
        this.distributeUsersVisible=true
        console.log(row)
        this.username=row.username
        this.role_name=row.role_name
        this.roleidid = row.id
        this.$http.get('/roles').then(res=>{
          if(res.data.meta.status!=200) return this.$message.error('获取角色列表失败')
          this.roleList=res.data.data
          console.log(this.roleList)
        })
      },
      allotUsers(){
        if(!this.selectedId) return this.$message.error('请选择角色')
        console.log(this.roleidid)
        console.log(this.selectedId)
        this.$http.put('/users/'+this.roleidid +'/role',{
          rid:this.selectedId
        }).then(res=>{
          console.log(res);
          if(res.data.meta.status!=200) return this.$message.error('设置失败')
          this.$message.success('设置成功')
          this.getUserList()
          this.distributeUsersVisible=false
        })
      },
      dialogDisClose(){
        this.selectedId=''
      }
    }
  }
</script>

<style type="text/css" lang="less" scoped>
.tagblock{
  display: flex;
  flex-direction: column;
}
.tagblock .el-tag{
  width: 220px;
  margin-bottom: 20px;
  font-size: 20px;
}

</style>
