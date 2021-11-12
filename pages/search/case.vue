<template lang="pug">
div
  b-input-group(prepend="　年"): b-input(v-model="year" type="number" :max="maxYear" min="87")
  b-input-group.my-1(prepend="　字"): b-select(v-model="code", :options="codeOpts")
  b-input-group(prepend="　號"): b-input(v-model="num" type="number" max="999999" min="100" step="100")
  .d-flex.my-1
    b-input-group.mr-1(prepend="地段"): b-select(
      v-model="section"
      :options="sectionOpts"
    )
    b-input-group(prepend="地號"): b-input(
      v-model="landNum"
    )
  b-button(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
import tycode from "~/assets/json/tycode.json"
import tysection from "~/assets/json/tysection.json"

export default {
  emit: ['data-update'],
  head: {
    title: '查詢 BY 案件-界標閱覽系統'
  },
  data: () => {
    const codes = [{ text: '', value: ''}];
    tycode?.forEach(element => {
      codes.push({
        text: `${element.value} ${element.text}`,
        value: element.value
      });
    });
    const sections = [{ text: '', value: ''}];
    tysection?.forEach(element => {
      sections.push({
        text: `${element.value} ${element.text}`,
        value: element.value
      });
    });
    const now = new Date()
    const defYear = now.getFullYear() - 1911
    const today = now.getFullYear() + '-' +
      ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
      ('0' + now.getDate()).slice(-2)
    return {
      year: '',
      maxYear: defYear,
      code: '',
      codeOpts: codes,
      num: '',
      section: '',
      sectionOpts: sections,
      landNum: '',
      opdate: today
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
