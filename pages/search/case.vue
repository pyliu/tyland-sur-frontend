<template lang="pug">
div
  b-input-group(prepend="案號"): b-input(v-model="caseId")
  b-button.mt-1(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '案件條件查詢-界標閱覽系統'
  },
  data: () => ({
    caseId: ''
  }),
  mounted () {
    this.$emit('data-update', { message: '收到案件查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
