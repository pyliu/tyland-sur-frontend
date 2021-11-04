<template lang="pug">
div
  b-input-group(prepend="案號"): b-input(v-model="caseId")
  .d-flex.my-1
    b-input-group.mr-1(prepend="地段"): b-select(
      v-model="section"
      :options="sectionOpts"
    )
    b-input-group(prepend="地號"): b-input(
      v-model="landNum"
    )
  b-button(variant="outline-primary" block) 🔎 搜尋
</template>

<script>
export default {
  emit: ['data-update'],
  head: {
    title: '案件條件查詢-界標閱覽系統'
  },
  data: () => ({
    caseId: '',
    section: '',
    sectionOpts: [
      { text: '測試段', value: '0100' }
    ],
    landNum: ''
  }),
  mounted () {
    this.$emit('data-update', { message: 'case emit!' })
  }
}
</script>

<style lang="scss" scoped>

</style>
