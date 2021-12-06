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
    :busy.sync="isBusy"
    responsive="sm"
    select-mode="single"
    selected-variant="warning"
    head-variant="dark"
    striped
    hover
    no-border-collapse
    borderless
    small
    selectable
    @row-selected="onRowSelected"
  )
    template(#table-busy) 讀取中...

    template(#cell(#)="row")
      b-checkbox(v-model="row.detailsShowing" @change="row.toggleDetails")
    
    template(#cell(num)="{ item }")
      a.link(@click="saveWip(item)" v-b-popover.hover.focus.top="formatedCaseId(item)") {{ caseId(item) }}
    
    template(#cell(section)="{ item }")
      span(v-b-popover.hover.focus.top="item.section") {{ sections.get(item.section) || item.section }}
    
    template(#cell(opdate)="{ item }")
      span(v-b-popover.hover.focus.top="'複丈日期'") {{ item.opdate }}
    
    template(#row-details="{ item }")
      CaseItem(:raw="item" card)
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
      // {
      //   key: '#',
      //   label: '詳情',
      //   sortable: false
      // },
      {
        key: 'num',
        label: "案號",
        sortable: true
      },
      {
        key: 'section',
        label: "段名",
        sortable: true
      },
      {
        key: 'opdate',
        label: "日期",
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
    },
    formatedCaseId(caseData) {
      return `${("000" + caseData.year).slice(-3)} 年 ${this.codes.get(caseData.code)}(${caseData.code}) 字 ${("000000" + caseData.num).slice(-6)} 號`;
    },
    saveWip(caseData) {
      this.$store.commit("wip", caseData);
      this.$router.push(`/case/${this.caseId(caseData)}/${caseData.section}/${caseData.opdate}`);
    },
    onRowSelected(items) {
      items[0] && this.modal(this.$createElement("CaseItem", {
        props: { raw: items[0], card: true }
      }), {
        title: "案件地號列表",
        size: "lg"
      });
      this.$refs.caseList?.clearSelected();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
