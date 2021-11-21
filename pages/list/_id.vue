<template lang="pug">
b-card(v-if="dataReady", :title="formatedCaseId", :sub-title="`立案者：${creator}`")
  b-card-text
    b-input-group.my-1(prepend="　　地段"): b-select(
      v-model="caseData.section",
      :options="sectionOpts",
      :state="sectionOK"
    )
    b-input-group(prepend="複丈日期"): b-input(
      v-model="caseData.opdate",
      type="date",
      :max="maxOpdate",
      :state="opdateOK"
    )
    b-button.mt-1(
      v-if="isOwner",
      block,
      :variant="ok ? 'primary' : 'outline-secondary'",
      :disabled="!ok",
      @click="modify"
    )
      b-icon.mr-1(icon="pencil-square")
      span 修改
.text-center.mt-5(v-else-if="isBusy")
  b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="4")
h4.text-center.mt-5(v-else) ⚠ 找不到資料 ‼
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  head: {
    title: "案件詳情-界標閱覽系統",
  },
  data: () => ({
    caseData: {},
    sectionOpts: [],
    maxOpdate: "",
  }),
  computed: {
    sectionOK() {
      return !isEmpty(this.caseData.section);
    },
    opdateOK() {
      return !isEmpty(this.caseData.opdate);
    },
    ok() {
      return this.sectionOK && this.opdateOK;
    },
    queryCaseId() {
      return this.$route.params.id;
    },
    formatedYear() {
      return ("000" + this.caseData.year).slice(-3);
    },
    formatedCode() {
      return ("XXXX" + this.caseData.code).slice(-4);
    },
    formatedNum() {
      return ("000000" + this.caseData.num).slice(-6);
    },
    caseId() {
      return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`;
    },
    formatedCaseId() {
      return `${this.formatedYear} 年 ${this.code}(${this.formatedCode}) 字 ${this.formatedNum} 號`;
    },
    rawCaseId() {
      return this.caseId.replaceAll("-", "");
    },
    opdate() {
      return this.caseData.opdate;
    },
    sectionCode() {
      return this.caseData.section;
    },
    section() {
      return this.sections.get(this.caseData.section);
    },
    code() {
      return this.codes.get(this.caseData.code);
    },
    creator() {
      return this.caseData.creator;
    },
    dataReady() {
      return !isEmpty(this.wip) && this.$route.params.id === this.caseId;
    },
    isOwner() {
      return this.creator === this.userId;
    },
  },
  watch: {
    wip(val) {
      this.caseData = { ...val };
    },
  },
  created() {
    this.maxOpdate = this.today;
    this.sections.forEach((val, key, map) => {
      this.sectionOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
    this.caseData = { ...this.wip };
    if (!this.dataReady) {
      this.isBusy = true;
      console.warn(
        `STORE資料(${this.caseId})與查詢案件資料(${this.queryCaseId})不同，重新查詢DB ... `
      );
      const parts = this.queryCaseId.split("-");
      this.$axios
        .post("/api/search", {
          year: parts[0],
          code: parts[1],
          num: parts[2],
          limit: 1,
        })
        .then(({ data }) => {
          if (data.statusCode !== this.statusCode.SUCCESS) {
            this.warning(data.message, { subtitle: this.queryCaseId });
          } else {
            this.$store.commit("wip", data.payload[0]);
            this.notify(data.message);
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    }
  },
  methods: {
    modify() {
      this.$axios
        .post("/api/update", { ...this.caseData })
        .then(({ data }) => {
          if (data.statusCode === this.statusCode.SUCCESS) {
            this.$store.commit("wip", this.caseData);
            this.$store.commit("wipList", []);
            this.notify(data.message);
          } else {
            this.warning(data.message, { subtitle: this.queryCaseId });
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
