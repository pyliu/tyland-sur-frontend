<template lang="pug">
b-card.border-0(no-body)
  section(v-if="isValid")
    .d-flex.justify-content-between
      b-card-title {{ formatedCaseId }}
      .text-muted.small {{ paramCaseId }}
    b-card-body
      .h2.text-center 顯示圖片 ...
  .my-5.text-center.h1(v-else) ⚠ 重新新選擇案件
  //- CaseList.mt-2(:list="list", :loading="isBusy")
</template>

<script>
export default {
  head: {
    title: "案件列印-界標即可拍系統"
  },
  layout: 'print',
  data: () => ({
    caseData: {}
  }),
  computed: {
    isValid () {
      return this.caseData?.year && this.caseData?.code && this.caseData?.num;
    },
    caseId() {
      if (!this.isValid) {
        this.alert('案件資料有問題，請檢查主控台視窗!');
        console.warn(this.caseData);
        return false;
      }
      return ("000" + this.caseData.year).slice(-3) + '-'
        + ("XXXX" + this.caseData.code).slice(-4) + '-'
        + ("000000" + this.caseData.num).slice(-6);
    },
    formatedCaseId() {
      if (this.isValid) {
        return `${("000" + this.caseData.year).slice(-3)} 年 ${this.codes.get(this.caseData.code)}(${this.caseData.code}) 字 ${("000000" + this.caseData.num).slice(-6)} 號`;
      }
      return false;
    },
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
    this.caseData = {...this.wip};
  },
  mounted () {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
