<template lang="pug">
b-card(no-body) UPLOADER
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '使用者條件查詢-界標閱覽系統'
  },
  mounted () {
    this.$emit('data-update', { message: '接收使用者查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
