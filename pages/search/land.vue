<template lang="pug">
div
  .d-flex
    b-input-group.mr-1(prepend="地段"): b-select(
      v-model="section"
      :options="sectionOpts"
    )
    b-input-group(prepend="地號"): b-input(
      v-model="landNum"
    )
  b-button.mt-1(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '地段號條件查詢-界標閱覽系統'
  },
  data: () => ({
    section: '',
    sectionOpts: [
      { text: '測試段', value: '0100' }
    ],
    landNum: ''
  }),
  mounted () {
    this.$emit('data-update', { message: '接收地段號查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
