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
    template(#cell(#)="row")
      b-checkbox(v-model="row.detailsShowing" @change="row.toggleDetails")
    template(#cell(num)="{ item }")
      a.link(@click="saveWip(item)") {{ caseId(item) }}
    template(#cell(section)="{ item }") {{ sections.get(item.section) }}
    template(#row-details="{ item }")
      .pl-3.py-1: CaseItem(:raw="item" open)
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
      {
        key: '#',
        label: '詳情',
        sortable: false
      },
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
  mounted() {
    
    this.userMap.size === 0 && this.$axios
      .post("/api/user", {})
      .then(({ data }) => {
        console.log(data.message);
        if (data.statusCode > 0) {
          const users = data.payload;
          if (Array.isArray(users)) {
            users.forEach((user) => {
              this.userMap.set(user.id, user.name);
            });
          } else {
            console.warn(`payload 不是陣列`, users);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  },
  methods: {
    caseId(caseData) {
      return ("000" + caseData.year).slice(-3) + '-'
        + ("XXXX" + caseData.code).slice(-4) + '-'
        + ("000000" + caseData.num).slice(-6)
    },
    saveWip(caseData) {
      this.$store.commit("wip", caseData);
      this.$router.push(`/list/${this.caseId(caseData)}`);
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
