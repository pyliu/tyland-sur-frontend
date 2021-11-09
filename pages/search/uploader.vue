<template lang="pug">
div
  .d-flex
    b-input-group.mr-1(prepend="上傳使用者"): b-select(
      v-model="uploader"
      :options="uploaderOpts"
    )
  b-button.mt-1(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '上傳使用者查詢-界標閱覽系統'
  },
  data: () => ({
    uploader: '',
    uploaderOpts: [{ text: 'HAADMIN HA管理者', value: 'HAADMIN' }]
  }),
  mounted () {
    this.$emit('data-update', { message: '接收使用者查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
