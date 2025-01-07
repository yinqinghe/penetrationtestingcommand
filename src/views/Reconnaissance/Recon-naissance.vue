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
            <template #append>
              <el-button @click="copyToClipboard(command[commandName])"
                >复制</el-button
              >
            </template>
          </el-input>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" plain @click="mike()">Primary</el-button>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
    const commands = reactive({
      nmap: {
        主机发现: "nmap -sn 192.168.52.0/24",
        全端口扫描: "nmap --min-rate 10000 -p- XXX",
        "TCP SCAN": "nmap -sT --min-rate 1000 -p- XXX -oA nmapscan/ports",
        Assist:
          "grep open nmapscan/ports.nmap | awk -F'/' '{print $1}' | paste -sd ','  \nports=$(grep open nmapscan/ports.nmap | awk -F'/' '{print $1}')",
        "UDP SCAN": "nmap -sU --top-ports 20 XXX -OA nmapscan/udp",
        "Ports detail":
          "nmap -sT -sV -sC -O -p 80,135,445 XXX -oA nmapscan/detail",
        "Ports Vuln Scan":
          "nmap --script=vuln -p80,135,445 XXX -oA nmapscan/vuln",
      },
    });

    return {
      commands,
    };
  },
  methods: {
    mike() {
      console.log("===mmmmm", this.commands["nmap"]["主机发现"]);
      this.commands["nmap"]["主机发现"] = "hahha";
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        () => {},
        (err) => {
          console.error("无法复制文本: ", err);
        }
      );
    },
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