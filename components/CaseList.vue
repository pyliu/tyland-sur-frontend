<template lang="pug">
.text-center.mt-5(v-if="loading")
  b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="3")
div(v-else)
  .d-flex.justify-content-end(v-if="count > perPage")
    b-pagination(
      v-model="currentPage"
      :total-rows="count"
      :per-page="perPage"
      size="sm"
    )
  b-table.text-center(
    ref="caseList"
    :caption="caption"
    :items="list"
    :per-page="perPage"
    :current-page="currentPage"
    :fields="fields"
    responsive="sm"
    select-mode="single"
    selected-variant="warning"
    head-variant="dark"
    selectable
    striped
    hover
    no-border-collapse
    borderless
  )
    template(#table-busy) 讀取中...
    template(#cell(#)="row") {{ row.index + 1 }}
    template(#cell(num)="{ item }")
      b-list-group-item: CaseItem(:raw="item")
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
    currentPage: 1,
    fields: [
      '#',
      {
        key: 'num',
        label:"案號",
        sortable: true
      },
      {
        key: 'opdate',
        label:"複丈日期",
        sortable: true
      },
      {
        key: 'creator',
        label:"立案人",
        sortable: true
      }
    ]
  }),
  computed: {
    count() { return this.list.length; },
    caption() { return `找到 ${this.count} 筆案件資料`}
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
