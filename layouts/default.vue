<template lang="pug">
b-container(v-cloak fluid)
  Header
  Nuxt
  Footer
</template>

<script>
export default {
  async created() {
    const users = await this.getCache('usersCache');
    if (Array.isArray(users) && users.length > 0) {
      users.forEach(user => {
        this.userMap.set(user.id, user.name);
      });
    } else {
      await this.$store.dispatch('prepareUserMap');
      setTimeout(() => {
        const array = Array.from(this.userMap, ([id, name]) => ({ id, name }));
        const expire = this.$auth.strategies.local.options.token.maxAge || 1800;
        this.setCache('usersCache', array, expire * 1000);
        process.env.NODE_ENV !== 'production' && console.log(`儲存使用者資料 ${expire} 秒後到期`, array);
      }, 800);
    }
  }
}
</script>

<style lang="scss">
</style>
