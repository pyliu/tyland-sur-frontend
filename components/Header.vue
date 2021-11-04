<template lang="pug">
.d-flex.align-items-center.my-2
  b-img(src="~/assets/images/logo_sm.png")
  b-button.sidebar.ml-auto(v-b-toggle.sidebar-1, variant="outline-secondary"): b-icon(
    icon="layout-text-sidebar",
    font-scale="2.5"
  )
  b-sidebar#sidebar-1(
    title="選單",
    backdrop-variant="dark",
    shadow,
    right,
    backdrop
  )
    template(#footer="{ hide }")
      .text-right(@click="hide()"): b-img.img-fluid.m-2(
        src="~/assets/images/logo_lg.png",
        width="250"
      )
    div(v-if="loggedIn")
      NuxtLink(to="/search/case") 以案件號搜尋
      NuxtLink(to="/search/uploader") 以使用者搜尋
    h2.text-danger(v-else) 請先登入系統
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.sidebar {
  //   width: 64px;
  //   height: 64px;
  border-radius: 15px;
}
#sidebar-1 {
  background-image: url("~/assets/images/logo_sm.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  // background-position: calc(100% - 20px) calc(100% - 20px);
  background-position: 10px 10px;
  background-size: 180px 55px;
}
</style>
