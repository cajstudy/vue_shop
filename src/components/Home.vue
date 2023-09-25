<template>
  <div >


      <el-container>
        <!-- 头部区域 -->
        <el-header>Header
           <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
          <!-- 页面侧边栏 -->
          <el-aside width="200px">Aside</el-aside>
          <el-main>Main</el-main>
        </el-container>
      </el-container>

  </div>
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
.el-header{
background-color: #8B4726;
}

</style>