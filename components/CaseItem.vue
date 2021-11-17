<template lang="pug">
div {{ caseId }}
</template>

<script>
import tycode from "~/assets/json/tycode.json"
import tysection from "~/assets/json/tysection.json"

export default {
  props: {
    raw: { type: Object, require: true }
  },
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
    return {
      codeOpts: codes,
      sectionOpts: sections
    }
  },
  computed: {
    formatedYear() { return ("000" + this.raw.year).slice(-3); },
    formatedCode() { return ("XXXX" + this.raw.code).slice(-4); },
    formatedNum() { return ("000000" + this.raw.num).slice(-6); },
    caseId() { return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`; },
    rawCaseId() { return this.caseId.replaceAll("-", ""); }
  },
  mounted () {
    // this.$emit('data-update', { message: '收到案件查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
