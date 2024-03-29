<template lang="pug">
section
  .d-flex.align-items-center.justify-content-between.mt-2
    b-img.logo(src="~/assets/images/logo_bureau.png", @click="toIndex")
    b-button.sidebar.ml-2(
      v-if="loggedIn",
      v-b-toggle.sidebar-1,
      variant="outline-dark",
      title="側邊選單"
    ): b-icon.mt-1(
      icon="list",
      font-scale="1.8"
    )
    b-button.sidebar.ml-2(
      v-else-if="$route.path !== '/login'",
      to="/login",
      variant="primary"
    ) #[b-icon(icon="box-arrow-in-right", font-scale="1.5")] 登入
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
        b-icon.mr-2(icon="card-list", variant="success")
        NuxtLink(to="/case") 案件列表
    hr
    ul
      li.h5
        b-icon.mr-2(icon="plus-circle-fill", variant="primary")
        NuxtLink(to="/add") 新增案件
      li.h5
        b-icon.mr-2(icon="briefcase-fill", variant="info")
        NuxtLink(to="/search/case") 搜尋案件
      li.h5
        b-icon.mr-2(icon="upload", variant="info")
        NuxtLink(to="/search/uploader") 搜尋上傳者
    hr
    div(v-if="userAuthority.isAdmin")
      ul
        li.h5
          b-icon.mr-2(icon="wrench", variant="primary")
          NuxtLink(to="/code") 代碼管理
        li.h5
          b-icon.mr-2(icon="people-fill", variant="danger")
          NuxtLink(to="/user") 使用者管理
        li.h5
          b-icon.mr-2(icon="info-square-fill", variant="success")
          NuxtLink(to="/stats") 統計數據
      hr
    ul: li.h5
      b-icon.mr-2(icon="key", variant="danger" rotate="315")
      b-button.p-0(@click="$refs.password.show()", variant="link", size="lg") 變更密碼
    hr
    b-modal(
      ref="password",
      :title="`修改 ${userName} 密碼`",
      size="sm",
      centered,
      hide-footer
    ): Password(@close="$refs.password.hide()")
    template(#footer="{ hide }")
      .d-flex.align-items-center.justify-content-between.p-2
        b-button.mr-2(
          variant="outline-danger",
          pill,
          @click="logout",
          :disabled="disabled"
        )
          b-icon.mr-1(icon="box-arrow-right")
          b-icon(v-if="disabled", icon="three-dots", animation="cylon")
          span(v-else) 登出
        b-img.logo.img-fluid(
          src="~/assets/images/logo_bureau.png",
          @click="toIndex"
        )
</template>

<script>
import Password from "~/components/Password.vue";
export default {
  components: { Password },
  data: () => ({
    disabled: false,
  }),
  computed: {
    sidebarTitle() {
      const adminStar = this.userAuthority.isAdmin ? "🌟" : "";
      return this.user ? `${adminStar} ${this.user.id} ${this.user.name}` : "選單";
    },
  },
  methods: {
    toIndex() {
      this.$router.push("/");
    },
    logout() {
      this.disabled = true;
      this.$auth
        .logout()
        .then(() => {
          this.notify("已登出", { type: "success" });
          this.$router.push("/login");
          this.clearStoreState();
        })
        .finally(() => {
          this.disabled = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  border-radius: 10px;
  height: 100%;
}
.logo {
  cursor: pointer;
  max-width: 250px;
}
#sidebar-1 {
  hr {
    margin: 5px 10px;
  }
  ul {
    padding-left: 20px;
    margin: 0.75rem 0;
    li {
      list-style: none;
    }
  }
  .logo {
    max-width: 200px;
  }
}
</style>
