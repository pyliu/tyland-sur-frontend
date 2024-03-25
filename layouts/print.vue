<template lang="pug">
b-container(v-cloak fluid)
  Nuxt
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
