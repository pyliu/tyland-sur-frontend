<template lang="pug">
b-container: b-card
  b-card-title.text-center 登入測量即可拍系統
  b-container
  b-form-group(
    label="帳號",
    label-for="input-account",
    valid-feedback="",
    :invalid-feedback="accInvalidFeedback",
    :state="accState"
  ): b-input#input-account(
    v-model="loginInfo.userid",
    :state="accState",
    placeholder="請輸入帳號",
    trim
  )
  b-form-group(
    label="密碼",
    label-for="input-password",
    valid-feedback="",
    :invalid-feedback="pwInvalidFeedback",
    :state="pwState"
  ): b-input#input-password(
    type="password",
    v-model="loginInfo.password",
    :state="pwState",
    placeholder="請輸入密碼",
    trim,
    @keyup.enter="userLogin"
  )
  .text-center: b-button(
    variant="primary",
    @click="userLogin",
    :disabled="btnDisabled"
  )
    b-icon.mr-1(icon="box-arrow-in-right")
    b-icon(v-if="isBusy", icon="three-dots", animation="cylon")
    span(v-else) 登入
</template>

<script>
export default {
  auth: "guest",
  head: {
    title: "登入系統-測量即可拍",
  },
  data: () => ({
    loginInfo: {
      userid: "",
      password: "",
    },
  }),
  computed: {
    btnDisabled() {
      if (this.isBusy) {
        return true;
      }
      return !this.pwState || !this.accState;
    },
    accState() {
      return this.loginInfo.userid.length >= 4;
    },
    accInvalidFeedback() {
      if (this.loginInfo.userid.length > 0) {
        return "請輸入至少4個字元";
      }
      return "請輸入帳號。";
    },
    pwState() {
      return this.loginInfo.password.length > 0;
    },
    pwInvalidFeedback() {
      return "請輸入密碼。";
    },
    maxAge() {
      // seconds
      return this.$auth.strategies.local.options.token.maxAge || 1800;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    userLogin() {
      if (!this.isBusy) {
        try {
          this.isBusy = true;
          this.clearStoreState();
          this.$auth
            .loginWith("local", {
              data: { ...this.loginInfo, maxAge: this.maxAge },
            })
            .then(({ data }) => {
              const site = this.loginInfo.userid?.substring(0, 2);
              if (site) {
                this.notify(data.message, { type: "success" });
                this.loadSiteData();
              } else {
                this.alert(`無法辨識所別，目前登入使用者為 ${this.loginInfo.userid}`);
              }
            })
            .catch((err) => {
              console.warn(err);
              this.warning("⚠ 登入失敗，認帳號密碼正確？帳戶是否已停用？");
            })
            .finally(() => {
              setTimeout(() => {
                this.loginInfo.userid = "";
                this.loginInfo.password = "";
                this.isBusy = false;
              }, 1000);
            });
        } catch (err) {
          console.error(err);
          this.alert(err.toString());
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
