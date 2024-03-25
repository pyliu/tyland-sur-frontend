<template lang="pug">
b-card.border-0(no-body)
  b-card-title: .d-flex.align-items-center
    span 案件列印列表 - 
    .mx-1 最近
    b-spinbutton.mx-1(
      v-model="count",
      min="10",
      max="100",
      inline
    )
    span 件
  CasePrintList(:list="list", :loading="isBusy")
</template>

<script>
import debounce from 'lodash/debounce';
export default {
  head: {
    title: "案件列印列表-界標即可拍系統"
  },
  data: () => ({
    list: [],
    count: 20
  }),
  created() {
    this.load();
    this.debouncedLoad = debounce(this.load, 500);
  },
  watch: {
    count(dontcare) {
      this.debouncedLoad();
    }
  },
  methods: {
    load() {
      this.clearWipState();
      this.isBusy = true;
      this.$axios
        .post("/api/search/case", { limit: this.count, code: `^${this.site}` })
        .then(({ data }) => {
          if (Array.isArray(data.payload)) {
            this.list = [...data.payload];
          }
          this.$store.commit('wipList', this.list);
        })
        .catch((err) => {
          this.warning('讀取案件列表有問題，請檢查主控台訊息!')
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
