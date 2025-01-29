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
        "MFTECmd.exe": {
          解析MFT文件: "MFTECmd.exe -f $MFT --csv ./ --csvf mft.csv",
        },
        "MFTExplorer.exe": {
          解析MFT文件: "MFTExplorer.exe -f $MFT --csv ./ --csvf mft.csv",
        },
        "PECmd.exe": {
          解析PF文件夹:
            "PECmd.exe -d D:\\Download\\Compressed\\SneakyCookies\\TRIAGE-L3-BELLS\\C\\Windows\\prefetch --csv . --csvf prefetch_.csv",
          解析PF文件:
            "PECmd.exe -f D:\\Download\\Compressed\\SneakyCookies\\TRIAGE-L3-BELLS\\C\\Windows\\prefetch --csv . --csvf prefetch_.csv",
        },
        "LECmd.exe": {
          解析lnk文件:
            'LECmd.exe -f "christmas_slab.pdf.lnk" --csv "result.csv"',
        },
        "EvtxECmd.exe": {
          "解析evtx文件夹(admin权限)":
            'EvtxECmd.exe -d "location of .evtx dir" --csv . --csvf result.csv',
          解析evtx文件:
            'EvtxECmd.exe -f "location of .evtx file" --csv "location where you want to save the file" --csvf result.csv',
          解析单个文件toJSON:
            'EvtxECmd.exe -f "C:\\TempApplication.evtx" --json "c:\\tempjsonout.csv"',
          只特定事件ID:
            'EvtxECmd.exe -f "C:\\Security.evtx" --csv . --csvf Example.csv --inc 5379',
        },
        "KAPE(admin权限)": {
          "RegistryHives(admin权限)":
            'kape.exe --tsource L: --target RegistryHives --tdest "c:\\temp\\RegistryOnly"',
          "解析文件夹(admin权限)":
            'kape.exe --msource "D:\\TRIAGE-L3-BELLS" --module !EZParser --mdest "D:\\tmp" --trace --debug',
        },
      },
      Link: {
        "PECmd.exe": "https://github.com/EricZimmerman/PECmd",
        "MFTExplorer.exe":
          "https://download.ericzimmermanstools.com/net6/MFTExplorer.zip",
        "Timeline Explorer":
          "https://download.ericzimmermanstools.com/net9/TimelineExplorer.zip",
        "KAPE(admin权限)":
          "https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape",
        "LECmd.exe": "https://github.com/EricZimmerman/LECmd",
        "EvtxECmd.exe": [
          "https://download.ericzimmermanstools.com/EvtxECmd.zip",
          "https://medium.com/@hammazahmed40/exploring-evtxecmd-a-beginners-guide-to-parsing-windows-event-logs-0f67115ac7cd",
          "https://github.com/EricZimmerman/evtx",
        ],
        "SysTools VHDX Viewer ": "https://www.systoolsgroup.com/vhdx/viewer/",
        AccessData_FTK_Imager:
          "https://www.exterro.com/ftk-product-downloads/ftk-imager-4-7-3-81",
        other: "https://ericzimmerman.github.io/#!index.md",
        pentest: "https://github.com/enaqx/awesome-pentest",
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