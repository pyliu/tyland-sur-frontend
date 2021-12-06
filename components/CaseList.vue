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
      .d-flex.justify-content-center
        .link.mr-1(@click="saveWip(item)", :title="formatedCaseId(item)") {{ caseId(item) }}
        b-button.p-1.border-0(@click="onRowSelected([item])", variant="outline-primary", size="sm", title="打開視窗") #[b-icon(icon="window")]
        b-button.p-1.border-0(v-if="isCaseCreator(item)", @click="remove(item)", variant="outline-danger", size="sm", title="刪除案件") ❌
    
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
        title: this.formatedCaseId(items[0]),
        size: "lg"
      });
      this.$refs.caseList?.clearSelected();
    },
    isCaseCreator(item) { return item?.creator === this.userId; },
    remove(item) {
      this.confirm(`此動作將會<b style="color: red">刪除</b>本案件下<b style="color:red">所有資料</b>，請確認是否刪除？`, {
        title: this.formatedCaseId(item)
      }).then((YN) => {
        if (YN) {
          this.$axios.delete(`/api/case/${this.caseId(item)}/${item.section}/${item.opdate}`, {
            data: { _id: item._id }
          })
          // this.$axios.delete(`/api/case/${item._id}`)
          .then(({ data }) => {
            if (data.statusCode > 0) {
              this.success(data.message);
              let foundIdx = -1;
              this.list.find((oitem, idx) => {
                if (oitem._id === item._id) {
                  foundIdx = idx;
                  return true;
                }
                return false;
              });
              if (foundIdx !== -1) {
                this.list.splice(foundIdx, 1);
              }
            } else {
              this.warning(data.message);
            }
          }).catch((err) => {
            this.alert(err.toString());
          }).finally(() => {

          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
