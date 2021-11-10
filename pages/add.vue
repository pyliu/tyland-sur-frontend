<template lang="pug">
b-card
  b-card-title.d-flex.align-items-center
    span.mr-auto 新增案件
  b-card-text
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
    b-input-group(prepend="複丈日期"): b-input(v-model="opdate" type="date" :max="maxOpdate")
</template>

<script>
import tycode from "~/assets/json/tycode.json"
import tysection from "~/assets/json/tysection.json"

export default {
  data: () => {
    const codes = [];
    tycode?.forEach(element => {
      codes.push({
        text: `${element.value} ${element.text}`,
        value: element.value
      });
    });
    const sections = [];
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
      year: defYear,
      maxYear: defYear,
      code: 'HA46',
      codeOpts: codes,
      num: 100,
      section: '',
      sectionOpts: sections,
      landNum: '',
      opdate: today,
      maxOpdate: today
    }
  },
  computed: {
    caseId () { return `${this.year}${this.code}${this.num}` }
  },
}
</script>

<style lang="scss" scoped>
</style>
