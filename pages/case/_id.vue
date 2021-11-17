<template lang="pug">
b-card
  b-card-text {{ caseId }}
</template>

<script>
export default {
  head: {
    title: "案件列表-界標閱覽系統"
  },
  data: () => ({
  }),
  computed: {
    caseId() { return this.$route.params.id }
  },
  created() {
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
};
</script>

<style lang="scss" scoped>
</style>
