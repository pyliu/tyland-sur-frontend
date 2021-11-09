<template lang="pug">
section
  .d-flex.align-items-center.justify-content-between.mt-2
    b-img.logo(src="~/assets/images/logo_sm.png", @click="toIndex")
    b-button.sidebar.ml-2(
      v-if="loggedIn",
      v-b-toggle.sidebar-1,
      variant="outline-dark"
      title="側邊選單"
    ): b-icon(
      icon="card-list",
      font-scale="1.8"
    )
    b-button(v-else-if="$route.path !== '/login'" to="/login" variant="primary") #[b-icon(icon="box-arrow-in-right", font-scale="1.5")] 登入
  hr
  b-sidebar#sidebar-1(
    :title="sidebarTitle",
    backdrop-variant="dark",
    shadow,
    right,
    backdrop
  )
    hr
    ul
      li.h5
        b-icon.mr-2(icon="plus-circle-fill" variant="primary")
        NuxtLink(to="/add") 新增案件
    hr
    ul
      li.h5
        b-icon.mr-2(icon="briefcase-fill" variant="dark")
        NuxtLink(to="/search/case") 以案件號搜尋
      li.h5
        b-icon.mr-2(icon="image-alt" variant="dark")
        NuxtLink(to="/search/land") 以地段號搜尋
      li.h5
        b-icon.mr-2(icon="people-fill" variant="dark")
        NuxtLink(to="/search/uploader") 以使用者搜尋
    hr
    template(#footer="{ hide }")
      .d-flex.align-items-center.justify-content-between.p-2
        b-button.mr-2(variant="outline-danger", pill, @click="logout", :disabled="disabled")
          b-icon.mr-1(icon="box-arrow-right")
          b-icon(v-if="disabled" icon="three-dots" animation="cylon")
          span(v-else) 登出
        b-img.img-fluid(src="~/assets/images/logo_lg.png", width="200")

</template>

<script>
export default {
  data: () => ({
    disabled: false
  }),
  computed: {
    sidebarTitle () { return this.user?.id ? `${this.user?.id} ${this.user?.name}` : '選單' }
  },
  methods: {
    toIndex () {
      this.$router.push('/');
    },
    logout () {
      this.disabled = true;
      this.$auth.logout().then(() => {
        this.notify('已登出', { type: 'success' });
        this.$router.push('/login');
      }).finally(() => { this.disabled = false; });
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
  hr {
    margin: 5px 10px;
  }
  ul {
    padding-left: 20px;
    li {
      list-style: none;
    }
  }
}
</style>
