<template lang="pug">
.d-flex.justify-content-between.align-items-center.text-primary(:title="caseId" @click="saveWip")
  span {{ formatedCaseId }}
  span 複丈日期 #[span {{ opdate }}]
  span(:title="sectionCode") {{ section }}
  span {{ creator }}
</template>

<script>
export default {
  props: {
    raw: { type: Object, require: true }
  },
  data: () => ({}),
  computed: {
    formatedYear() { return ("000" + this.raw.year).slice(-3); },
    formatedCode() { return ("XXXX" + this.raw.code).slice(-4); },
    formatedNum() { return ("000000" + this.raw.num).slice(-6); },
    caseId() { return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`; },
    formatedCaseId() { return `${this.formatedYear} 年 ${this.code}(${this.formatedCode}) 字 ${this.formatedNum} 號`; },
    rawCaseId() { return this.caseId.replaceAll("-", ""); },
    opdate() { return this.raw.opdate; },
    sectionCode() { return this.raw.section; },
    section() { return this.sections.get(this.raw.section); },
    code() { return this.codes.get(this.raw.code); },
    creator() { return this.raw.creator; }
  },
  methods: {
    saveWip() {
      this.$store.commit('wip', this.raw)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
