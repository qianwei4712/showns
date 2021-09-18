<template>
  <div class="applyHome">
    🩹🐻‍❄️🩲✨💌🕳️💣🛀🛌🧱🌡️🎊🎉🎈🧧💎🖨️⚙️💥🙊🐱🦊🐺🦄🐴🐽🐸🐊🐢🐍🐳🐡🦈🐛🌸🌳🌍🌐☀☁🌧️🌈🌊💧🩸👒👑👓🧳🧖🎅👰‍🤵‍👨‍🙋👵🧠🦷👂👀👅👄💪🤲
    <br>

    <div class="margin-top">
      <el-tag
          v-for="item in items"
          :key="item.label"
          :effect="item.effect"
          :type="item.type"
          @click="openTab(item)">
        {{ item.label }}
      </el-tag>
    </div>

  </div>
</template>

<script>
export default {
  name: "applyHome",
  data() {
    return {
      items: [
        // success/info/warning/danger
        {label: '修改内容前后变动日志', type: 'success', effect: 'dark'}
      ]
    }
  },
  methods: {
    openTab(item) {
      window.open("https://gitee.com/qianwei4712/showns/solutions/" + item.label + ".md", '_blank');
    }
  }
}
</script>

<style scoped>
.margin-top {
  margin-top: 20px;
}
.el-tag {
  margin-right: 10px;
  cursor: pointer;
}
</style>
