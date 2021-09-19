<template>
  <div class="applyHome">
    🩹🐻‍❄️🩲✨💌🕳️💣🛀🛌🧱🌡️🎊🎉🎈🧧💎🖨️⚙️💥🙊🐱🦊🐺🦄🐴🐽🐸🐊🐢🐍🐳🐡🦈🐛🌸🌳🌍🌐☀☁🌧️🌈🌊💧🩸👒👑👓🧳🧖🎅👰‍🤵‍👨‍🙋👵🧠🦷👂👀👅👄💪🤲
    <br>

    <div class="margin-top">
      <el-tag
          v-for="item in items"
          :key="item.label"
          :effect="item.effect"
          :color="item.color"
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
        // type: success / info / warning / danger
        // effect: dark / light / plain
        {label: '修改内容前后变动日志', type: 'success', effect: 'dark'},
        {label: '银行卡号获得Bin信息', type: 'info', effect: 'light'}

      ]
    }
  },
  methods: {
    openTab(item) {
      window.open("https://gitee.com/qianwei4712/showns/blob/master/solutions/" + item.label + ".md", '_blank');
    }
  }
}
</script>

<style scoped>
.margin-top {
  margin-top: 20px;
}
.el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
