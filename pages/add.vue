<template lang="pug">
div
  b-card
    b-card-title.d-flex.align-items-center
      span.mr-auto 新增案件
      span.small.text-muted {{ this.caseId }}
    b-card-text
      b-input-group(prepend="　　　年"): b-input(
        v-model="year",
        type="number",
        :max="maxYear",
        min="87",
        :state="yearOK"
      )
      b-input-group.my-1(prepend="　　　字"): b-select(
        v-model="code",
        :options="codeOpts",
        :state="codeOK"
      )
      b-input-group(prepend="　　　號"): b-input(
        v-model="num",
        type="number",
        max="999999",
        min="100",
        step="100",
        :state="numOK"
      )
      b-input-group.my-1(prepend="　　地段"): b-select(
        v-model="section",
        :options="sectionOpts",
        :state="sectionOK"
      )

      b-input-group(prepend="複丈日期"): b-input(
        v-model="opdate",
        type="date",
        :max="maxOpdate",
        :state="opdateOK"
      )
      b-button.mt-1(
        block,
        title="確認新增",
        :variant="ok ? 'primary' : 'outline-secondary'",
        :disabled="!ok",
        @click="add"
      )
        b-icon.mr-1(icon="plus")
        span 新增案件
  hr
  h5 最近案件
  CaseList(:list="recentCases", :loading="isBusy" :per-page="5" :class="recentCases.length > 5 ? 'shift-up' : ''")
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  head: {
    title: '新增案件-界標閱覽系統'
  },
  data: () => {
    const now = new Date();
    const defYear = now.getFullYear() - 1911;
    return {
      year: defYear,
      maxYear: defYear,
      code: "",
      codeOpts: [],
      num: "",
      section: "",
      sectionOpts: [],
      opdate: '',
      maxOpdate: '',
      creator: "",
      recentCases: [],
    };
  },
  computed: {
    yearOK() {
      const iYear = parseInt(this.year, 10);
      return iYear <= this.maxYear && iYear >= 87;
    },
    codeOK() {
      return this.notEmpty(this.code);
    },
    numOK() {
      const iNum = parseInt(this.num, 10);
      return iNum > 0 && iNum < 1000000;
    },
    sectionOK() {
      return parseInt(this.section) > 0;
    },
    opdateOK() {
      return this.notEmpty(this.opdate);
    },
    ok() {
      return (
        this.yearOK &&
        this.numOK &&
        this.codeOK &&
        this.sectionOK &&
        this.opdateOK
      );
    },
    formatedYear() {
      return ("000" + this.year).slice(-3);
    },
    formatedCode() {
      return ("XXXX" + this.code).slice(-4);
    },
    formatedNum() {
      return ("000000" + this.num).slice(-6);
    },
    caseId() {
      return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`;
    },
    rawCaseId() {
      return this.caseId.replaceAll("-", "");
    },
    postBody() {
      return {
        token: this.userTokenHash,
        site: this.site,
        year: this.formatedYear,
        code: this.formatedCode,
        num: this.formatedNum,
        opdate: this.opdate,
        section: this.section.toString(),
        creator: this.creator,
        lands: [],
      };
    },
  },
  created() {
    this.creator = this.userId;
    this.opdate = this.maxOpdate = this.today;
    this.loadRecentCases();
    this.loadSiteData();
    // codes/sections which is Map structure from global mixin
    this.codes.forEach((val, key, map) => {
      this.codeOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
    this.sections.forEach((val, key, map) => {
      this.sectionOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
  },
  methods: {
    notEmpty(val) {
      return !isEmpty(val);
    },
    loadRecentCases() {
      this.isBusy = true;
      this.$axios
        .post("/api/search/case", { limit: 5, code: `^${this.site}` })
        .then(({ data }) => {
          this.recentCases = [...data.payload];
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
    add() {
      const expire = this.userExpire;
      const now = +new Date();
      if (now > expire) {
        this.$router.push("/login");
      } else {
        this.$axios
          .post("/api/add", this.postBody)
          .then(({ data }) => {
            // console.log(data.payload)
            if (data.statusCode === this.statusCode.SUCCESS) {
              this.success(data.message);
              this.loadRecentCases();
              // clear wip list because of new case added
              this.$store.commit("wipList", []);
            } else {
              this.warning(data.message);
            }
          })
          .catch((err) => {
            console.warn(err);
          })
          .finally(() => {
            this.code = "";
            this.num = "";
            this.opdate = "";
            this.section = "";
          });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.shift-up {
  margin-top: -32.5px;
}
</style>
