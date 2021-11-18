<template lang="pug">
.text-center.mt-5(v-if="loading")
  b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="4")
b-list-group(v-else, flush)
  b-list-group-item(
    v-for="(item, idx) in list",
    :key="`case-${idx}`",
    :to="`/list/${caseId(item)}`"
  ): CaseItem(
    :raw="item"
  )
</template>

<script>
export default {
  props: {
    list: { type: Array, require: true },
    loading: { type: Boolean, default: false }
  },
  methods: {
    caseId(caseData) {
      return ("000" + caseData.year).slice(-3) + '-'
        + ("XXXX" + caseData.code).slice(-4) + '-'
        + ("000000" + caseData.num).slice(-6)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
