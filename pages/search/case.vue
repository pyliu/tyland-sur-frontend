<template lang="pug">
div
  b-input-group(prepend="年"): b-input(v-model="year" type="number" max="111" min="104")
  b-input-group.my-1(prepend="字"): b-select(v-model="code", :options="codeOpts")
  b-input-group(prepend="號"): b-input(v-model="num" type="number" max="999999" min="100" step="100")
  b-button.mt-1(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
import tycode from "~/assets/json/tycode.json"

export default {
  emit: ['data-update'],
  head: {
    title: '案件號查詢-界標閱覽系統'
  },
  data: () => {
    const codes = [];
    tycode?.forEach(element => {
      codes.push({
        text: `${element.value} ${element.text}`,
        value: element.value
      });
    });
    return {
      year: 110,
      code: 'HA46',
      codeOpts: codes,
      num: 100
    }
  },
  computed: {
    caseId () { return `${this.year}${this.code}${this.num}` }
  },
  mounted () {
    this.$emit('data-update', { message: '收到案件查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
