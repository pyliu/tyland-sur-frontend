<template lang="pug">
b-card.border-0(no-body)
  b-card-title: .d-flex.align-items-center {{ site }} 統計數據
  b-card-body
    h4 目前建立案件數量：{{ caseCount }}
    h4 目前建立界標數量：{{ markCount }}
    h4 目前上傳圖檔數量：{{ imgCount }}
  
</template>

<script>
export default {
  head: {
    title: "綜合統計-界標即可拍系統"
  },
  data: () => ({
    imgCount: '讀取中',
    caseCount: '讀取中',
    markCount: '讀取中'
  }),
  created() {
    this.loadUploadedImageCount();
    this.loadCasesCount();
    this.loadMarksCount();
  },
  watch: { },
  methods: {
    loadUploadedImageCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/uploaded`)
        .then(({ data }) => {
          this.imgCount = data.payload
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
    loadCasesCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/cases`)
        .then(({ data }) => {
          this.caseCount = data.payload
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
    loadMarksCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/marks`)
        .then(({ data }) => {
          this.markCount = data.payload
        })
        .catch((err) => {
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
