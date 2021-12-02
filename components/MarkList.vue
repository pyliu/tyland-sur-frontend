<template lang="pug">
.text-center.mt-5(v-if="loading")
  b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="3")
div(v-else)
  .d-flex.justify-content-end(
    v-if="count > perPage"
    style="margin-top: -35px;"
  )
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
    :fields="fields"
    :per-page="perPage"
    :current-page="currentPage"
    :busy.sync="isBusy"
    responsive="sm"
    select-mode="single"
    selected-variant="warning"
    head-variant="dark"
    selectable
    striped
    hover
    no-border-collapse
    borderless
    small
    @row-selected="rowSelected"
  )
    template(#table-busy) 讀取中...
    template(#cell(#)="row")
      b-checkbox(v-model="row.detailsShowing" @change="row.toggleDetails")
    template(#cell(num)="{ item }")
      b-button.p-1.border-0(
        variant="outline-primary",
        size="sm",
        @click="clearWipOpen(item)",
        v-b-popover.hover.focus.top="formatedCaseId(item)"
      ): b-icon(icon="caret-right-fill")
    template(#cell(creator)="{ item }")
      span(v-b-popover.hover.focus.top="item.creator") {{ userMap.get(item.creator) || item.creator }}
    template(#cell(section)="{ item }")
      span(v-b-popover.hover.focus.top="item.section") {{ sections.get(item.section) }}
    template(#cell(number)="{ item }")
      span {{ formatedNumber(item) }}
    template(#row-details="{ item }")
      span NOT IMPLEMENTED
</template>

<script>
import isEmpty from "lodash/isEmpty";

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
        key: 'opdate',
        label: "複丈日期",
        sortable: true
      },
      {
        key: 'section',
        label: "段名",
        sortable: true
      },
      {
        key: 'number',
        label: "地號",
        sortable: true
      },
      {
        key: 'serial',
        label: "編號",
        sortable: true
      },
      {
        key: 'type',
        label: "類型",
        sortable: true
      },
      {
        key: 'creator',
        label: "上傳人",
        sortable: true
      },
      {
        key: 'num',
        label: "案件",
        sortable: false
      }
    ]
  }),
  computed: {
    count() { return this.list.length; },
    caption() { return `找到 ${this.count} 筆界標資料`}
  },
  methods: {
    caseId(markData) {
      return ("000" + markData.year).slice(-3) + '-'
        + ("XXXX" + markData.code).slice(-4) + '-'
        + ("000000" + markData.num).slice(-6)
    },
    formatedCaseId(markData) {
      return `${("000" + markData.year).slice(-3)} 年 ${this.codes.get(markData.code)}(${markData.code}) 字 ${("000000" + markData.num).slice(-6)} 號`;
    },
    formatedNumber(markData) {
      const parent = parseInt(markData.number?.substring(0, 4));
      const child = parseInt(markData.number?.substring(4));
      if (isEmpty(child)) {
        return parent;
      } else {
        return `${parent}-${child}`;
      }
    },
    clearWipOpen(markData) {
      this.$store.commit("wip", undefined);
      window.open(`/case/${this.caseId(markData)}/${markData.section}/${markData.opdate}`, "_blank", "noopener");
    },
    rowSelected(rowItems) {
      const selected = rowItems[0];
      if (selected) {
        this.modal(this.$createElement("MarkCard", {
          props: { raw: selected }
        }), {
          title: `界標圖片 - ${this.sections.get(selected.section)}`,
          size: "xl"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
