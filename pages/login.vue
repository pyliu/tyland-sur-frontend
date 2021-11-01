<template lang="pug">
b-container
  div
    b-form-group(
      description="請輸入帳號"
      label="帳號"
      label-for="input-account"
      valid-feedback="感謝您!"
      :invalid-feedback="invalidFeedback"
      :state="state"
    )
      b-input(id="input-account" v-model="account" :state="state" trim)
</template>

<script>
export default {
  watch: {
    user(val) { console.log(val) }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
