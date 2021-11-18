<template lang="pug">
b-card.border-0(no-body)
  b-card-title 案件列表
  CaseList(:list="list", :loading="busy")
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
    this.busy = true;
    this.$axios
      .post("/api/search", { limit: 20 })
      .then(({ data }) => {
        this.list = [...data.payload];
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => {
        this.busy = false;
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
