<template lang="pug">
b-card(no-body)
  b-card-header(header-tag='nav')
    b-nav(card-header pills fill)
      b-nav-item(to="/search/" exact exact-active-class="active") 案件號
      b-nav-item(to="/search/uploader/" exact exact-active-class="active") 上傳者
  b-card-body
    nuxt-child
</template>

<script>
import FooterVue from "../components/Footer.vue"

export default {
  head: {
    title: '查詢-界標閱覽系統'
  },
  route: [
    {
      path: '/search',
      // We don't provide a name on this parent route, but rather
      // set the name on the default child route instead
      // name: 'some-route',
      component: FooterVue,
      // Child route "tabs"
      children: [
        // Note we provide the above parent route name on the default child tab
        // route to ensure this tab is rendered by default when using named routes
        { path: '', component: FooterVue, name: 'some-route' },
        { path: 'uploader', component: FooterVue }
      ]
    }
  ]
}
</script>

<style lang="scss" scoped>

</style>
