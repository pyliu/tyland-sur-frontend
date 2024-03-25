<template lang="pug">
b-card.border-0(no-body)
  b-card-title {{ formatedCaseId(wip) }}
  b-card-sub-title {{ paramCaseId }}
  CaseList.mt-2(:list="list", :loading="isBusy")
</template>

<script>
export default {
  head: {
    title: "案件列印-界標即可拍系統"
  },
  layout: 'print',
  data: () => ({
    list: [],
  }),
  computed: {
    paramCaseId() {
      return this.$route.params.case_id;
    },
    paramCaseYear() {
      return this.paramCaseId.substring(0, 3);
    },
    paramCaseCode() {
      return this.paramCaseId.substring(4, 8);
    },
    paramCaseNum() {
      return this.paramCaseId.substring(9);
    }
  },
  created() {
    this.list = [this.wip];
  },
  methods: {
    caseId(caseData) {
      if (!caseData.year || !caseData.code || !caseData.num) {
        this.alert('案件資料有問題，請檢查主控台視窗!');
        console.warn(caseData);
        return false;
      }
      return ("000" + caseData.year).slice(-3) + '-'
        + ("XXXX" + caseData.code).slice(-4) + '-'
        + ("000000" + caseData.num).slice(-6)
    },
    formatedCaseId(caseData) {
      if (this.caseId(caseData)) {
        return `${("000" + caseData.year).slice(-3)} 年 ${this.codes.get(caseData.code)}(${caseData.code}) 字 ${("000000" + caseData.num).slice(-6)} 號`;
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
