<template lang="pug">
b-card
  b-card-text {{ caseId }}
</template>

<script>
import isEmpty from 'lodash/isEmpty';

export default {
  head: {
    title: "案件列表-界標閱覽系統"
  },
  data: () => ({
  }),
  computed: {
    queryCaseId() { return this.$route.params.id; },
    formatedYear() { return ("000" + this.wip.year).slice(-3); },
    formatedCode() { return ("XXXX" + this.wip.code).slice(-4); },
    formatedNum() { return ("000000" + this.wip.num).slice(-6); },
    caseId() { return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`; },
    formatedCaseId() { return `${this.formatedYear} 年 ${this.code}(${this.formatedCode}) 字 ${this.formatedNum} 號`; },
    rawCaseId() { return this.caseId.replaceAll("-", ""); },
    opdate() { return this.wip.opdate; },
    sectionCode() { return this.wip.section; },
    section() { return this.sections.get(this.wip.section); },
    code() { return this.codes.get(this.wip.code); },
    creator() { return this.wip.creator; }
    
  },
  created() {
    if (isEmpty(this.wip) || this.$route.params.id !== this.caseId) {
      // TODO: query case by => this.$route.params.id
      console.warn(`STORE資料(${this.caseId})與查詢案件資料(${this.queryCaseId})不同，重新查詢DB ... `);
      // this.$axios
      //   .post("/api/search", { limit: 20 })
      //   .then(({ data }) => {
      //     this.list = [...data.payload];
      //   })
      //   .catch((err) => {
      //     console.warn(err);
      //   })
      //   .finally(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
