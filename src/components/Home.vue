<template>
      <el-container class="home-container" >
        <!-- 头部区域 -->
        <el-header>
          <div>
            <img src="../assets/logo.png">
            <span>电商后台管理系统</span>
          </div>
           <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
          <!-- 页面侧边栏 -->
          <el-aside width="200px">
            <!-- 侧边栏菜单区域 -->
            <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b">
      <!-- 一级菜单 -->
      <el-submenu index="1">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item index="1-1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航2</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
          </el-aside>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
</template>

<script>
export default {
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    }

  }
 }
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
    }
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
img {
      width: 10%;
      height: 10%;
      border-radius: 50%;
      background-color: #eee;
    }

</style>