<template lang="pug">
div
  b-input-group.mr-1(prepend="　使用者"): b-select(
    v-model="uploader"
    :options="uploaderOpts"
  )
  b-input-group.mr-1.my-1(prepend="複丈日期"): b-input(
    type="date"
    v-model="opdate"
  )
  b-button(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '查詢 BY 上傳使用者-界標閱覽系統'
  },
  data: () => ({
    opdate: '',
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
