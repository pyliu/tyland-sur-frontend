<template lang="pug">
b-card(no-body) CASE
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '根據案件查詢-界標閱覽系統'
  },
  mounted () {
    this.$emit('data-update', { message: 'case emit!' })
  }
}
</script>

<style lang="scss" scoped>

</style>
