<template lang="pug">
b-container
  b-form-group(
    label="帳號",
    label-for="input-account",
    valid-feedback="",
    :invalid-feedback="accInvalidFeedback",
    :state="accState"
  ): b-input#input-account(
    v-model="account",
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
    v-model="password",
    :state="pwState",
    placeholder="請輸入密碼",
    trim
  )
  .text-center: b-button(
    variant="primary"
    @click="login"
    :disabled="!pwState || !accState"
  ) 登入
</template>

<script>
export default {
  data: () => ({
    account: "",
    password: "",
  }),
  computed: {
    accState() {
      return this.account.length >= 4;
    },
    accInvalidFeedback() {
      if (this.account.length > 0) {
        return "請輸入至少4個字元";
      }
      return "請輸入帳號。";
    },
    pwState() {
      return this.password.length > 0;
    },
    pwInvalidFeedback() {
      return "請輸入密碼。";
    },
  },
  watch: {},
  mounted () {
    console.log(this.$config)
  },
  methods: {
    login () {
      this.$axios.post('http://localhost:4500/login', {
        account: this.account,
        password: this.password
      }).then(({ data }) => {
        console.log(data)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
