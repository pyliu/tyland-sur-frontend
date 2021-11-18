<template lang="pug">
.d-flex.justify-content-between.align-items-center.text-primary(:title="raw._id.toString()")
  span(:title="caseId") {{ formatedCaseId }}
  span 複丈日期 #[span {{ opdate }}]
  span(:title="sectionCode") {{ section }}
  span {{ creator }}
</template>

<script>
import tycode from "~/assets/json/tycode.json"
import tysection from "~/assets/json/tysection.json"

export default {
  props: {
    raw: { type: Object, require: true }
  },
  data: () => {
    const codeMap = new Map();
    tycode?.forEach(element => {
      codeMap.set(element.value, element.text);
    });
    const sectionMap = new Map();
    tysection?.forEach(element => {
      sectionMap.set(element.value, element.text);
    });
    return {
      codes: codeMap,
      sections: sectionMap
    }
  },
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
  mounted () {
    // this.$emit('data-update', { message: '收到案件查詢回傳DATA' })
    console.log(this.raw._id);
  }
}
</script>

<style lang="scss" scoped>

</style>
