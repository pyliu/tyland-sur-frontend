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
    if (map && map.size > 0) {
      this.$store.commit('userMap', map);
    } else {
      await this.$store.dispatch('prepareUserMap');
      // cached time aligned with $auth config
      const expire = this.$auth.strategies.local.options.token.maxAge || 1800;
      this.setCache('userMap', this.userMap, expire * 1000);
    }
  }
}
</script>

<style lang="scss">
</style>
