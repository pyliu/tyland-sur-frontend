<template lang="pug">
b-card.border-0(no-body)
  b-card-title: .d-flex.align-items-center {{ site }} 統計數據 {{ stDate }} ~ {{ edDate }}
  b-card-sub-title: .d-flex.align-items-center 
    span(v-if="!stDateState || !edDateState") ❌ 日期區間不正確，請重新選擇 #[b-button(variant="outline-success", size="sm", @click="resetDates") 預設值]
    span(v-else) ✅ 統計日期區間
  .d-flex.align-items-center.my-2
    b-datepicker(v-model="stDate", :state="stDateState", :max="today")
    .mx-1 ~
    b-datepicker(v-model="edDate", :state="edDateState", :max="today")
  h5 目前建立案件數量：{{ caseCount }}
  h5 目前建立界標數量：{{ markCount }}
  h5 目前上傳圖檔數量：{{ imgCount }}
  
</template>

<script>
export default {
  head: {
    title: "綜合統計數據-界標即可拍系統"
  },
  data: () => ({
    stDate: '',
    edDate: '',
    imgCount: '讀取中',
    caseCount: '讀取中',
    markCount: '讀取中'
  }),
  computed: {
    stDateState() {
      return !this.isEmpty(this.stDate) && this.stDate <= this.edDate;
    },
    edDateState() {
      return !this.isEmpty(this.edDate) && this.edDate >= this.stDate;
    }
  },
  created() {
    this.resetDates();
    this.loadUploadedImageCount();
    this.loadCasesCount();
    this.loadMarksCount();
  },
  watch: { },
  methods: {
    resetDates() {
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      this.stDate = firstDayOfMonth.toLocaleDateString('zh-TW').replaceAll('/', '-');
      this.edDate = this.today;
    },
    loadUploadedImageCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/uploaded`)
        .then(({ data }) => {
          this.imgCount = data.payload
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
    loadCasesCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/cases`)
        .then(({ data }) => {
          this.caseCount = data.payload
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
    loadMarksCount() {
      this.isBusy = true;
      this.$axios
        .get(`/api/stats/${this.site}/marks`)
        .then(({ data }) => {
          this.markCount = data.payload
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
