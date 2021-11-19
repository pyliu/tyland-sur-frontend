<template lang="pug">
div
  b-input-group.mr-1(prepend="　使用者"): b-select(
    v-model="uploader"
    :options="uploaderOpts"
  )
  b-input-group.mr-1.my-1(prepend="複丈日期"): b-input(
    type="date"
    v-model="opdate"
    :max="maxOpdate"
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
    maxOpdate: '',
    uploader: '',
    uploaderOpts: [{ text: 'HAADMIN HA管理者', value: 'HAADMIN' }]
  }),
  created () {
    // this.$emit('data-update', { message: '接收使用者查詢回傳DATA' })
    this.opdate = this.maxOpdate = this.today;
    this.uploader = this.userId;
  }
}
</script>

<style lang="scss" scoped>

</style>
