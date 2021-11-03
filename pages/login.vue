<template lang="pug">
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
    trim
  )
  .text-center: b-button(
    variant="primary",
    @click="userLogin",
    :disabled="busy || !pwState || !accState"
  ) 登入
</template>

<script>
export default {
  auth: "guest",
  data: () => ({
    loginInfo: {
      userid: "",
      password: "",
    },
    busy: false,
  }),
  computed: {
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
  },
  methods: {
    async userLogin() {
      try {
        this.busy = true;
        this.$auth
          .loginWith("local", {
            data: this.loginInfo,
          })
          .then((response) => {
            this.$router.push("/");
          })
          .catch((err) => {
            console.warn(err);
            this.warning("登入失敗，請確認帳號密碼是否正確 ... ");
          })
          .finally(() => {
            this.loginInfo.userid = "";
            this.loginInfo.password = "";
          });
      } catch (err) {
        console.error(err);
        this.alert(err.toString());
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
