<template lang="pug">
b-container(v-cloak fluid)
  Header(print="none")
  Nuxt
  Footer(print="none")
</template>

<script>
export default {
  created() {
    this.prepareUserMap();
  },
  mounted() {
    this.loadSiteData();
  }
}
</script>

<style lang="scss">
</style>
