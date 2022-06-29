<template lang="pug">
b-card.border-0(no-body)
  b-card-title 案件列表
  CaseList(:list="list", :loading="isBusy")
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
    this.clearWipState();
    this.isBusy = true;
    this.$axios
      .post("/api/search/case", { limit: 20, code: `^${this.site}` })
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
