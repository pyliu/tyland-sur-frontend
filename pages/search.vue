<template lang="pug">
div
  b-card(no-body)
    b-card-header(header-tag="nav")
      b-nav(card-header, pills, fill)
        b-nav-item(to="/search/case", exact, exact-active-class="active") 案件
        b-nav-item(to="/search/uploader", exact, exact-active-class="active") 上傳者
    b-card-body
      //- https://nuxtjs.org/examples/routing/nested-pages/
      NuxtChild(@data-update="handleDataUpdate")
</template>

<script>
import CaseList from "../components/CaseList.vue";
export default {
  head: {
    title: "查詢案件-界標閱覽系統",
  },
  data: () => ({
    searchedData: [],
  }),
  created() {
    ["/search", "/search/"].includes(this.$route.path) && this.$router.push("/search/case");
    this.search();
  },
  methods: {
    handleDataUpdate(data) {
      this.notify(data.message);
      data.raw && (this.searchedData = [...data.raw]);
    },
    search(filter = {}) {
      this.isBusy = true;
      this.$axios
        .post("/api/search", filter)
        .then(({ data }) => {
          this.searchedData = [...data.payload];
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    }
  },
  components: { CaseList },
};
</script>

<style lang="scss" scoped>
</style>
