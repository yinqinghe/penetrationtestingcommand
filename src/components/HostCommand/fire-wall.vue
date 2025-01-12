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
        Windows: {
          "2003之前版本,指定程序允许全部连接":
            'netsh firewall add allowedprogram c:\nc.exe "allownc" enable',
          "2003之后版本,指定程序允许全部连接":
            'netsh advfirewall firewall add rule name="pass nc"dir=in action=allow program="C:\\nc.exe"',
          允许指定程序出站网络通信:
            'netsh advfirewall firewall add rule name="Allownc" dir=out action=allow program="C:\\nc.exe" ',
          "3389端口放行":
            'netsh advfirewall firewall add rule name="RemoteDesktop" protocol=TCP dir=in localport=3389 action=allow',
          是否运行RDP连接:
            'REG QUERY "HKEY_LOCAL_MACHINESYSTEMCurrentControlSetControlTerminal Server" /v fDenyTSConnections \n1表示关闭，0表示开启',
          查看RDP连接端口:
            'REG QUERY "HKEY_LOCAL_MACHINESYSTEMCurrentControlSetControlTerminal ServerWinStationsRDP-Tcp" /v PortNumber',
          开启3389RDP连接:
            'REG ADD "HKLMSYSTEMCurrentControlSetControlTerminal Server" /v fDenyTSConnections /t REG_DWORD /d 00000000 /f \nREG ADD "HKEY_LOCAL_MACHINESYSTEMCurrentControlSetControlTerminal ServerWinStationsRDP-Tcp" /v PortNumber /t REG_DWORD /d 0x00000d3d /f',
        },
        Linux: {
          "Ubuntu / Debian": "sudo ufw disable ",
          "CentOS / Fedora / RHEL":
            "sudo systemctl stop firewalld \nsudo systemctl disable firewalld",
          "Arch Linux":
            "sudo systemctl stop iptables \nsudo systemctl disable iptables ",
          openSUSE:
            "sudo systemctl stop SuSEfirewall2 \nsudo systemctl disable SuSEfirewall2 ",
          Gentoo:
            "sudo rc-update delete iptables default \nsudo /etc/init.d/iptables stop",
          Slackware: "sudo /etc/rc.d/rc.firewall stop",
          "Alpine Linux":
            "sudo /etc/init.d/iptables stop \nsudo rc-update del iptables",
        },
      },
    };
  },
};
</script>
