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
          <el-sub-menu index="3">
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
          <el-sub-menu index="4">
            <template #title>
              <span>HTB</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click="$router.push('attacktip')"
                >attack-tip</el-menu-item
              >
              <el-menu-item index="4-2">item two</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <span>内网渗透</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="5-1"
                @click="$router.push('domainpenetration')"
                >域渗透</el-menu-item
              >
              <el-menu-item index="5-2">item two</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header
          style="
            display: flex;
            align-items: center;
            height: 100px;
            overflow: hidden;
            border-bottom: 1px solid #e0e0e0;
          "
        >
          <div style="margin-right: 10px; display: flex; align-items: center">
            <label for="input1" style="flex: 0 0 auto">Local-IP:</label>
            <el-input
              v-model="local_ip"
              placeholder="请输入local_ip"
            ></el-input>
          </div>

          <div style="margin-right: 10px; display: flex; align-items: center">
            <label for="input2" style="flex: 0 0 auto">Attack-IP:</label>
            <el-input
              v-model="attack_ip"
              placeholder="请输入attack_ip"
            ></el-input>
          </div>

          <div style="margin-right: 10px; display: flex; align-items: center">
            <label for="input3" style="flex: 0 0 auto">Attack-Domain:</label>
            <el-input
              v-model="attack_domain"
              placeholder="请输入attack_domain"
            ></el-input>
          </div>
          <el-button type="primary" @click="confirm">确认</el-button>
        </el-header>
        <el-main><router-view></router-view> </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { checkSharedData } from "@/utils/utils.js";
import { mapActions } from "vuex";
export default {
  mounted() {
    const cookieValue = checkSharedData("sharedData"); // 替换为您的 Cookie 名称
    if (cookieValue) {
      console.log("读取到的 Cookie 值:", cookieValue["local_ip"]);
      this.local_ip = cookieValue["local_ip"];
      this.attack_ip = cookieValue["attack_ip"];
      this.attack_domain = cookieValue["attack_domain"];
      this.confirm();
    }
  },
  methods: {
    ...mapActions(["updateData"]),
    confirm() {
      const newData = {
        local_ip: this.local_ip,
        attack_ip: this.attack_ip,
        attack_domain: this.attack_domain,
      };
      console.log("===", newData);
      this.updateData(newData);
    },
  },
  data() {
    return {
      local_ip: "",
      attack_ip: "",
      attack_domain: "",
    };
  },
};
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