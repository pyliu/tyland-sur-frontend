<template lang="pug">
b-container(v-cloak fluid)
  Header
  Nuxt
  Footer
</template>

<script>
export default {
  async created() {
    this.prepareUserMap();
  }
}
</script>

<style lang="scss">
</style>
