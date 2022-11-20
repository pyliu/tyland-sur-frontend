<template lang="pug">
b-card.border-0(no-body)
  b-card-title: .d-flex.align-items-center {{ site }} 統計數據 {{ stDate }} ~ {{ edDate }}
  b-card-sub-title: .d-flex.align-items-center 
    span(v-if="!stDateState || !edDateState") ❌ 日期區間不正確，請重新選擇 #[b-button(variant="outline-success", size="sm", @click="resetDates") 預設值]
    span(v-else) ✅ 統計日期區間
  .d-flex.align-items-center.my-2
    b-datepicker(
      v-model="stDate",
      :state="stDateState",
      :max="today",
      :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
    )
    .mx-1 ~
    b-datepicker(
      v-model="edDate",
      :state="edDateState",
      :max="today", dark,
      :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
    )
  b-button(
    v-if="stDateState && edDateState"
    variant="outline-primary",
    :disabled="isBusy",
    @click="search"
  ) 🔍 查詢
  transition(name="slide-fade", mode="out-in")
    b-spinner.my-2(v-if="isBusy")
    div(v-else)
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
    firstDayOfMonth: new Date(),
    stDate: '',
    edDate: '',
    imgCount: '',
    caseCount: '',
    markCount: ''
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
    this.firstDayOfMonth.setDate(1);
  },
  watch: {
    isBusy(flag) {
      if (flag) {
        this.imgCount = '讀取中';
        this.caseCount = '讀取中';
        this.markCount= '讀取中';
      }
    }
  },
  methods: {
    resetDates() {
      this.stDate = this.firstDayOfMonth.toLocaleDateString('zh-TW').replaceAll('/', '-');
      this.edDate = this.today;
    },
    async search() {
      try {
        this.isBusy = true;
        const [t1, t2, t3] = await Promise.all([
          this.loadUploadedImageCount(),
          this.loadCasesCount(),
          this.loadMarksCount()
        ]);
        // console.warn(t1, t2, t3);
      } catch(err) {
        console.error(err);
      } finally {
        this.isBusy = false;
      }
    },
    loadUploadedImageCount() {
      return new Promise((resolve, reject) => this.$axios
        .post(`/api/stats/mongodb/uploaded/${this.site}/${this.stDate}/${this.edDate}`)
        .then(({ data }) => {
          this.imgCount = data.payload;
          resolve(data);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
      );
    },
    loadCasesCount() {
      return new Promise((resolve, reject) => this.$axios
        .get(`/api/stats/${this.site}/cases`)
        .then(({ data }) => {
          this.caseCount = data.payload;
          resolve(data);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
      );
    },
    loadMarksCount() {
      return new Promise((resolve, reject) => this.$axios
        .post(`/api/stats/mongodb/marks/${this.site}/${this.stDate}/${this.edDate}`)
        .then(({ data }) => {
          this.markCount = data.payload;
          resolve(data);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
