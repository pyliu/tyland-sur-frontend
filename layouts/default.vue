<template lang="pug">
b-container(v-cloak fluid)
  Header
  Nuxt
  Footer
</template>

<script>
export default {
  async created() {
    const map = await this.getCache('userMap');
    if (map) {
      this.$store.commit('userMap', map);
    } else {
      await this.$store.dispatch('prepareUserMap');
      // cache a day
      this.setCache('userMap', this.userMap, 86400000);
    }
  }
}
</script>

<style lang="scss">
</style>
