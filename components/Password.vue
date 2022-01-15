<template lang="pug">
div(role="group")
  label(for="input-live") 修改密碼:
  b-form-input#input-live(
    v-model="password",
    type="password",
    :state="isPasswordOK",
    aria-describedby="input-live-feedback",
    placeholder="輸入欲變更的密碼",
    trim=""
  )
  b-form-invalid-feedback#input-live-feedback(v-if="passwordChanged") 請輸入至少8個字元的密碼
  b-form-invalid-feedback#input-live-feedback(v-else) 與目前密碼相同，無法變更!
  label.mt-2(for="input-live") 確認密碼:
  b-form-input#input-live2(
    v-model="verify",
    type="password",
    :state="isVerified",
    aria-describedby="input-live-feedback2",
    placeholder="確認欲變更的密碼",
    trim="",
    :disabled="!isPasswordOK"
  )
  b-form-invalid-feedback#input-live-feedback2(v-if="isPasswordOK") 與輸入變更密碼不同
  .text-center: b-button.mt-2(
    size="sm",
    :variant="passwordChanged && isVerified ? 'primary' : 'outline-primary'",
    :disabled="!passwordChanged || !isVerified",
    @click="modify"
  ) 修改
</template>

<script>
import isEmpty from "lodash/isEmpty";
import MD5 from "crypto-js/md5";

export default {
  emit: ['close'],
  data: () => ({
    password: "",
    verify: "",
  }),
  computed: {
    isPasswordOK() {
      if (isEmpty(this.password)) {
        return null;
      }
      if (this.password.length > 7) {
        if (this.passwordChanged) {
          return true;
        }
      }
      return false;
    },
    isVerified() {
      if (this.isPasswordOK) {
        return this.password === this.verify;
      } else {
        return null;
      }
    },
    passwordChanged() {
      return this.user.pwd !== MD5(this.password).toString();
    },
  },
  methods: {
    modify() {
      this.confirm("請確定要修改密碼?").then((YN) => {
        if (YN) {
          this.$axios
            .put(`/api/user/${this.userId}`, {
              pwd: MD5(this.password).toString(),
            })
            .then(({ data }) => {
              if (data.statusCode > 0) {
                this.success(data.message);
                this.user.pwd = MD5(this.password).toString();
              } else {
                this.warning(data.message);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.password = "";
              this.verify = "";
              this.$emit('close')
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
