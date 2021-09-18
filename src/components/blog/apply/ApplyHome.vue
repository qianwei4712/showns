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
        {label: '银行卡号获得卡Bin信息', type: 'success', effect: 'dark', href: 'http://shiva.show'}
      ]
    }
  },
  methods: {
    openTab(item) {
      window.open(item.href, '_blank');
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
