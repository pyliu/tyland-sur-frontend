<template lang="pug">
b-card(v-if="dataReady")
  b-card-text {{ caseId }}
.text-center.mt-5(v-else-if="busy")
  b-icon(
    icon="arrow-clockwise",
    animation="spin-pulse",
    font-scale="4"
  )
h4.text-center.mt-5(v-else) ⚠ 找不到資料 ‼
</template>

<script>
import isEmpty from 'lodash/isEmpty';

export default {
  head: {
    title: "案件列表-界標閱覽系統"
  },
  data: () => ({
    busy: false
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
    creator() { return this.wip.creator; },
    dataReady() { return !isEmpty(this.wip) && this.$route.params.id === this.caseId }

  },
  created() {
    if (!this.dataReady) {
      this.busy = true;
      console.warn(`STORE資料(${this.caseId})與查詢案件資料(${this.queryCaseId})不同，重新查詢DB ... `);
      const parts = this.queryCaseId.split('-');
      this.$axios
        .post("/api/search", {
          year: parts[0],
          code: parts[1],
          num: parts[2],
          limit: 1
        })
        .then(({ data }) => {
          if (data.statusCode !== this.statusCode.SUCCESS) {
            this.warning(data.message, { subtitle: this.queryCaseId });
          } else {
            this.$store.commit('wip', data.payload[0]);
            this.notify(data.message);
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
