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
  updateCommands,
  resetCommands,
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
        ffuf: {
          目录爆破: `ffuf -u 'http://{{Attack_IP}}/test/.FUZZ' -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -e .txt,.pub,.bak -mc 200`,
          子域名爆破:
            "ffuf -u http://{{Attack_IP}} -w /usr/share/SecLists-2022.2/Discovery/DNS/bitquark-subdomains-top100000.txt -H 'Host:FUZZ.shoppy.htb' -fs 169",
          "SSRF探测(过滤大小为0的响应内容)":
            "ffuf -u 'http://{{Attack_IP}}/?url=\"http://127.0.0.1:FUZZ\"' -w /opt/SecLists/Fuzzing/4-digits-0000-9999.txt -fs 0",
        },
        dirsearch: {
          指定文件后缀:
            "dirsearch -u http://{{Attack_IP}} -f -e zip,jar,tar.gz --wordlists=/usr/share/dirb/wordlists/common.txt",
          使用默认字典排除状态码403: "dirsearch -u http://{{Attack_IP}} -x 403",
          指定字典:
            "dirsearch -u http://{{Attack_IP}} -x 403,401 -w /usr/share/wordlists/dirb/big.txt",
        },
        gobuster: {
          子域名爆破:
            "gobuster dns -d Domain-XX -t 50 -w /usr/share/amass/wordlists/subdomains-top1mil-5000.txt -i --wildcard",
          目录爆破:
            "gobuster dir -u http://{{Attack_IP}} -c 'session=123456' -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .php,.txt,.html,.zip -t 50",
          跳过TLS认证:
            "gobuster dir -k -u http://{{Attack_IP}} -c 'session=123456' -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .php,.txt,.html,.zip -t 50",
        },
        feroxbuster: {
          指定字典:
            "feroxbuster -u http://{{Attack_IP}} -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt",
          跳过TLS认证:
            "feroxbuster -u http://{{Attack_IP}} -x php -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories-lowercase.txt -k",
        },
        wfuzz: {
          隐藏特定的chars:
            'wfuzz -u http://{{Attack_IP}}/?FUZZ.php -w /usr/share/seclists/Discovery/Web-Content/burp-paraameter-names.txt -H "cookie: PHPSESSID=asdh231asdad" --hh 1678',
          指定POST数据隐藏特定的words:
            'wfuzz -u http://{{Attack_IP}} -w /usr/share/wordlists/rockyou.txt -d "key=FUZZ" --hw 25',
          子域名爆破:
            'wfuzz -u http://{{Attack_IP}} -H "HOST: FUZZ." -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --hh 315',
          指定请求头:
            'wfuzz -u http://{{Attack_IP}} -H "Host: FUZZ." --hc 302,400 -t 50 -H "User-Agent: luzesec" -c -z file,"/usr/share/seclists/Discovery/Web-Content/raft-small-words-lowercase.txt"',
          彩色输出:
            'wfuzz -u http://{{Attack_IP}} -c -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ." --hl 7',
        },
        hashcat: {
          破解MD5:
            "hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt",
          破解SHA256:
            "hashcat -m 1400 -a 0 hash.txt /usr/share/wordlists/rockyou.txt",
          破解SHA512:
            "hashcat -m 1700 -a 0 hash.txt /usr/share/wordlists/rockyou.txt",
          破解BCrypt:
            "hashcat -m 3200 -a 0 hash.txt /usr/share/wordlists/rockyou.txt",
        },
        john: {
          破解MD5:
            "john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt",
          破解SHA256:
            "john --format=raw-sha256 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt",
          破解SHA512:
            "john --format=raw-sha512 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt",
        },
      },
    };
  },
};
</script>
