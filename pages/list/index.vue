<template lang="pug">
b-card.border-0(no-body)
  b-card-title 案件列表
  b-list-group(flush)
    b-list-group-item(
      v-for="(item, idx) in list",
      :key="`case-${idx}`"
      :to="`/list/${caseId(item)}`"
    ): CaseItem(
      :raw="item"
    )
</template>

<script>
export default {
  head: {
    title: "案件列表-界標閱覽系統"
  },
  data: () => ({
    list: [],
  }),
  created() {
    this.$axios
      .post("/api/search", { limit: 20 })
      .then(({ data }) => {
        this.list = [...data.payload];
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => {});
  },
  methods: {
    caseId(caseData) {
      return ("000" + caseData.year).slice(-3) + '-'
        + ("XXXX" + caseData.code).slice(-4) + '-'
        + ("000000" + caseData.num).slice(-6)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
