<template lang="pug">
b-card.border-0(no-body)
  b-card-title: .d-flex.align-items-center 統計
  
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  head: {
    title: "統計-界標即可拍系統"
  },
  data: () => ({ }),
  created() {
    this.uploadedImageCount();
  },
  watch: { },
  methods: {
    uploadedImageCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/uploaded`)
        .then(({ data }) => {
          console.warn(data)
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
