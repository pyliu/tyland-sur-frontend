<template lang="pug">
section
  .d-flex.align-items-center.justify-content-between.mt-2
    b-img.logo(src="~/assets/images/logo_sm.png", @click="$router.push('/')")
    b-button.sidebar.ml-2(
      v-if="loggedIn",
      v-b-toggle.sidebar-1,
      variant="secondary"
    ): b-icon(
      icon="layout-text-sidebar",
      font-scale="1.5"
    )
    NuxtLink(v-else-if="$route.path !== '/login'" to="/login") #[b-icon(icon="box-arrow-in-right", font-scale="1.5")] 登入
  hr
  b-sidebar#sidebar-1(
    :title="sidebarTitle",
    backdrop-variant="dark",
    shadow,
    right,
    backdrop
  )
    template(#footer="{ hide }")
      .d-flex.align-items-center.justify-content-between.p-2
        b-button.mr-2(variant="outline-danger", pill, size="sm", @click="logout")
          b-icon(icon="box-arrow-right")
          span 登出
        b-img.img-fluid(src="~/assets/images/logo_lg.png", width="200")
    ul
      li.h5
        b-icon.mr-1(icon="briefcase")
        NuxtLink(to="/search/case") 以案件號搜尋
      li.h5
        b-icon.mr-1(icon="people")
        NuxtLink(to="/search/uploader") 以使用者搜尋
</template>

<script>
export default {
  computed: {
    sidebarTitle () { return this.user?.id ? `${this.user?.id} ${this.user?.name}` : '選單' }
  },
  methods: {
    logout () {
      this.$auth.logout().then(() => {
        this.notify('已登出', { type: 'success' });
        this.$router.push('/login');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  border-radius: 10px;
}
.logo {
  cursor: pointer;
  max-width: 200px;
}
#sidebar-1 {
  ul {
    padding: 10px;
    li {
      list-style: none;
    }
  }
}
</style>
