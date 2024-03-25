<template lang="pug">
b-card.border-0(no-body)
  b-card-title 案件列表
  b-card-sub-title {{ paramCaseId }}
  CaseList.mt-2(:list="list", :loading="isBusy")
</template>

<script>
export default {
  head: {
    title: "案件列表-界標即可拍系統"
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
  }
};
</script>

<style lang="scss" scoped>
</style>
