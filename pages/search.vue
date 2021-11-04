<template lang="pug">
b-card(no-body)
  b-card-header(header-tag='nav')
    b-nav(card-header pills fill)
      b-nav-item(to="/search/case" exact exact-active-class="active") 案件號
      b-nav-item(to="/search/uploader" exact exact-active-class="active") 上傳者
  b-card-body
    //- https://nuxtjs.org/examples/routing/nested-pages/
    NuxtChild(@data-update="handleDataUpdate")
</template>

<script>
export default {
  head: {
    title: '查詢案件-界標閱覽系統'
  },
  created () { this.$router.push('/search/case') },
  methods: {
    handleDataUpdate(data) {
      this.alert(data.message)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
