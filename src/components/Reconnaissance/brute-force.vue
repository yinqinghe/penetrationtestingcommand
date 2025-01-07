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
      ffuf: {
        目录爆破:
          "ffuf -u 'http://XXX/test/.FUZZ' -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -e .txt,.pub,.bak -mc 200",
        子域名爆破:
          "ffuf -u http://XXX -w /usr/share/SecLists-2022.2/Discovery/DNS/bitquark-subdomains-top100000.txt -H 'Host:FUZZ.shoppy.htb' -fs 169",
        "SSRF探测(过滤大小为0的响应内容)":
          "ffuf -u 'http://XXX/?url=\"http://127.0.0.1:FUZZ\"' -w /opt/SecLists/Fuzzing/4-digits-0000-9999.txt -fs 0",
      },
      dirsearch: {
        指定文件后缀:
          "dirsearch -u http://XXX -f -e zip,jar,tar.gz --wordlists=/usr/share/dirb/wordlists/common.txt",
        使用默认字典排除状态码403: "dirsearch -u http://XXX -x 403",
        指定字典:
          "dirsearch -u http://XXX -x 403,401 -w /usr/share/wordlists/dirb/big.txt",
      },
      gobuster: {
        子域名爆破:
          "gobuster dns -d Domain-XX -t 50 -w /usr/share/amass/wordlists/subdomains-top1mil-5000.txt -i --wildcard",
        目录爆破:
          "gobuster dir -u http://XXX -c 'session=123456' -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .php,.txt,.html,.zip -t 50",
        跳过TLS认证:
          "gobuster dir -k -u http://XXX -c 'session=123456' -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .php,.txt,.html,.zip -t 50",
      },
      feroxbuster: {
        指定字典:
          "feroxbuster -u http://XXX -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt",
        跳过TLS认证:
          "feroxbuster -u http://XXX -x php -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories-lowercase.txt -k",
      },
      wfuzz: {
        隐藏特定的chars:
          'wfuzz -u http://XXX/?FUZZ.php -w /usr/share/seclists/Discovery/Web-Content/burp-paraameter-names.txt -H "cookie: PHPSESSID=asdh231asdad" --hh 1678',
        指定POST数据隐藏特定的words:
          'wfuzz -u http://XXX -w /usr/share/wordlists/rockyou.txt -d "key=FUZZ" --hw 25',
        子域名爆破:
          'wfuzz -u http://XXX -H "HOST: FUZZ." -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --hh 315',
        指定请求头:
          'wfuzz -u http://XXX -H "Host: FUZZ." --hc 302,400 -t 50 -H "User-Agent: luzesec" -c -z file,"/usr/share/seclists/Discovery/Web-Content/raft-small-words-lowercase.txt"',
        彩色输出:
          'wfuzz -u http://XXX -c -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ." --hl 7',
      },
    });

    return {
      commands,
    };
  },
  methods: {
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
