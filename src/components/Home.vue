<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isFold ? '64px' : '200px'">
        <div class="fold" @click="foldClick">|||</div>
         <el-menu
      background-color="#D2DABF"
      text-color="#042b57"
      active-text-color="#409eef"
      :collapse="isFold"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="(item.id).toString()" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id"
        @click="secondClick('/'+items.path)">
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{items.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      menuList:[],
      iconsObj:{
        "125":'iconfont icon-users',
        "103":'iconfont icon-tijikongjian',
        "101":'iconfont icon-shangpin',
        "102":'iconfont icon-danju',
        "145":'iconfont icon-baobiao'
      },
      isFold:false,
      activePath:''
    }
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('/menus')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menuList=res.data
      //console.log(res.data)
    },
    foldClick(){
      this.isFold=!this.isFold
    },
    secondClick(path){
      window.sessionStorage.setItem('activePath',path)
      this.activePath=path
    }
  },
  created(){
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
}
</script>

<style type="text/css" lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  background-color: #99B9D0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
    span{
      margin-left: 10px;
    }
  }
}
.el-aside{
  background-color: #D2DABF;
  .el-menu{
    border-right: none !important;;
  }
  .fold{
    background-color: #a2daaa;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main{
  background-color: #96A99d;
}
.iconfont{
  margin-right: 10px;
}
</style>
