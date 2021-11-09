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
import tysection from "~/assets/json/tysection.json"
export default {
  emit: ['data-update'],
  head: {
    title: '地段號條件查詢-界標閱覽系統'
  },
  data: () => {
    const sections = [];
    tysection?.forEach(element => {
      sections.push({
        text: `${element.value} ${element.text}`,
        value: element.value
      });
    });
    return {
      section: '',
      sectionOpts: sections,
      landNum: ''
    }
  },
  mounted () {
    this.$emit('data-update', { message: '接收地段號查詢回傳DATA' })
  }
}
</script>

<style lang="scss" scoped>

</style>
