<template lang="pug">
b-container.center
  h1.d-flex.justify-content-center(v-if="error.statusCode === 404")
    .text-danger.mr-1 {{ error.statusCode }}
    span 找不到頁面
  h1.d-flex.justify-content-center(v-else)
    .text-danger.mr-1 {{ error.statusCode }}
    span 有錯誤發生
  h4 ⚠ {{ error.message }}
  nuxt-link(to="/") 👉🏻 回到首頁
</template>

<script>
export default {
  props: ['error'],
  layout: 'default' // you can set a custom layout for the error page
}
</script>

<style lang="scss" scoped>
.center {
  margin-top: calc(20vh - 0px);
  text-align: center;
}
</style>
