<template lang="pug">
b-container(v-if="!loggedIn")
  b-form-group(
    label="帳號",
    label-for="input-account",
    valid-feedback="",
    :invalid-feedback="accInvalidFeedback",
    :state="accState"
  ): b-input#input-account(
    v-model="loginInfo.username",
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
    type="password"
    v-model="loginInfo.password",
    :state="pwState",
    placeholder="請輸入密碼",
    trim
  )
  .text-center: b-button(
    variant="primary"
    @click="userLogin"
    :disabled="!pwState || !accState"
  ) 登入
b-container(v-else): NuxtLink(to="/") 已登入，回根目錄
</template>

<script>
export default {
  auth: false,
  data: () => ({
    loginInfo: {
      username: '',
      password: ''
    }
  }),
  computed: {
    accState() {
      return this.loginInfo.username.length >= 4;
    },
    accInvalidFeedback() {
      if (this.loginInfo.username.length > 0) {
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
  },
  mounted () {
    console.log(this.$store.state.auth)
  },
  methods: {
    async userLogin () {
      try {
        this.$auth.loginWith("local", {
          data: this.loginInfo
        }).then(({ data }) => {
          // this.$store.commit('login', data);

          this.$router.push("/");
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          this.loginInfo.username = ''
          this.loginInfo.password = ''
          console.log(this.$store.state.auth)
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
