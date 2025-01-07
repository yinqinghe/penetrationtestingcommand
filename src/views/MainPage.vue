<template>
  <div>
    <el-container style="height: 97dvh">
      <el-aside width="200px">
        <el-menu router="true">
          <el-sub-menu index="1">
            <template #title>
              <!-- <el-icon><location /></el-icon> -->
              <span>信息收集</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="1-1"
                @click="$router.push('/attack/Reconnaissance')"
                >Host Discover</el-menu-item
              >
              <el-menu-item
                index="1-2"
                @click="$router.push('/attack/filecheck')"
                >FileCheck</el-menu-item
              >
              <el-menu-item
                index="1-3"
                @click="$router.push('/attack/bruteforce')"
                >BruteForce</el-menu-item
              >
              <el-menu-item
                index="1-4"
                @click="$router.push('/attack/attackservice')"
                >AttackService</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <span>主机命令</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="$router.push('firewall')"
                >防火墙</el-menu-item
              >
              <el-menu-item index="2-2" @click="$router.push('other')"
                >item two</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="3" @click="$router.push('other')">
            <template #title>
              <span>权限提升</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">Brute</el-menu-item>
              <el-menu-item index="3-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="3-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>item four</template>
              <el-menu-item index="3-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main><router-view></router-view> </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {};
</script>
<style>
.common-layouts {
  height: 100vh; /* 确保布局占满整个视口高度 */
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #fefefe;
  color: #333;
  text-align: center;
}
</style>