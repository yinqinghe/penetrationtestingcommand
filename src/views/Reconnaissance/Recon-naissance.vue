<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item
        v-for="(command, key_c, index) in commands"
        :key="index"
        :name="index + 1"
      >
        <template #title>
          <span class="custom-title">{{ key_c }}</span>
        </template>
        <div
          v-for="(commandContent, commandName) in command"
          :key="commandName"
          class="input-container"
        >
          <label :for="key">{{ commandName }}:</label>
          <el-input
            :id="key"
            v-model="command[commandName]"
            readonly
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 5 }"
          >
          </el-input>
          <el-button @click="copyToClipboard(command[commandName])"
            >复制</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  copyToClipboard,
  resetCommands,
  updateCommands,
} from "@/utils/utils.js";
export default {
  computed: {
    ...mapState(["sharedData"]), // 映射 Vuex state
  },
  methods: {
    async copyToClipboard(text) {
      const message = await copyToClipboard(text);
      this.$message.success(message);
    },
  },
  watch: {
    sharedData(newValue) {
      const storedData = localStorage.getItem("sharedData");
      if (!storedData || JSON.stringify(newValue) !== storedData) {
        localStorage.setItem("sharedData", JSON.stringify(newValue));
        console.log("已更新 sharedData:", newValue);
      }
      console.log("共享数据更新:", newValue["local_ip"]); // 当 sharedData 变化时打印数据
      if (this.attack_ip !== "{{Attack_IP}}") {
        resetCommands(this.commands, this.attack_ip); // 更新命令
      }
      this.attack_ip = newValue["attack_ip"];
      updateCommands(this.commands, this.attack_ip); // 更新命令
    },
  },
  data() {
    return {
      attack_ip: "{{Attack_IP}}", // 使用 data 定义响应式数据
      commands: {
        nmap: {
          主机发现: "nmap -sn 192.168.52.0/24",
          全端口扫描: "nmap --min-rate 10000 -p- {{Attack_IP}}",
          "TCP SCAN":
            "nmap -sT --min-rate 1000 -p- {{Attack_IP}} -oA nmapscan/ports",
          Assist:
            "grep open nmapscan/ports.nmap | awk -F'/' '{print $1}' | paste -sd ','  \nports=$(grep open nmapscan/ports.nmap | awk -F'/' '{print $1}')",
          "UDP SCAN": "nmap -sU --top-ports 20 {{Attack_IP}} -OA nmapscan/udp",
          "Ports detail":
            "nmap -sT -sV -sC -O -p 80,135,445 {{Attack_IP}} -oA nmapscan/detail",
          "Ports Vuln Scan":
            "nmap --script=vuln -p80,135,445 {{Attack_IP}} -oA nmapscan/vuln",
        },
      },
    };
  },
};
</script>

<style>
.custom-title {
  font-size: 1.2em; /* 改变字体大小 */
  font-weight: bold; /* 加粗字体 */
}
.input-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 9px;
}

label {
  margin-right: 4px;
  width: 130px;
}
</style>