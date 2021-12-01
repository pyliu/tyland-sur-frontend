<template lang="pug">
b-card.border-0(no-body)
  b-card-title 案件列表
  b-card-sub-title {{ paramCaseId }} / {{ paramSection }} {{ section }}
  CaseList.mt-2(:list="list", :loading="isBusy")
</template>

<script>
export default {
  head: {
    title: "案件列表-界標閱覽系統"
  },
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
    },
    paramSection() {
      return this.$route.params.section;
    },
    section() {
      return this.sections.get(this.paramSection) || this.paramSection;
    }
  },
  created() {
    this.isBusy = true;
    this.$axios
      .post("/api/search/case", {
        year: this.paramCaseYear,
        code: this.paramCaseCode,
        num: this.paramCaseNum,
        section: this.paramSection
      })
      .then(({ data }) => {
        this.list = [...data.payload];
        this.$store.commit('wipList', this.list);
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => {
        this.isBusy = false;
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
