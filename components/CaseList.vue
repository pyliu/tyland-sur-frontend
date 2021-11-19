<template lang="pug">
.text-center.mt-5(v-if="loading")
  b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="3")
div(v-else)
  b-pagination.ml-auto(
    v-if="rows > perPage"
    v-model="currentPage"
    :total-rows="rows"
    :per-page="perPage"
    size="sm"
  )
  b-table(
    :items="list"
    :per-page="perPage"
    :current-page="currentPage"
    small
  )
  //- b-list-group(flush)
  //-   b-list-group-item(
  //-     v-for="(item, idx) in list",
  //-     :key="`case-${idx}`",
  //-     :to="`/list/${caseId(item)}`"
  //-   ): CaseItem(
  //-     :raw="item"
  //-   )
</template>

<script>
export default {
  props: {
    list: { type: Array, require: true },
    loading: { type: Boolean, default: false },
    perPage: { type: Number, default: 10 }
  },
  data: () => ({
    currentPage: 1
  }),
  computed: {
    rows() { return this.list.length; }
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
