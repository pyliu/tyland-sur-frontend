<template lang="pug">
div
  b-input-group(prepend="　年"): b-input(
    v-model="year",
    type="number",
    :max="maxYear",
    min="87"
  )
  b-input-group.my-1(prepend="　字"): b-select(v-model="code", :options="codeOpts")
  b-input-group(prepend="　號"): b-input(
    v-model="num",
    type="number",
    max="999999",
    min="100",
    step="100"
  )
  .d-flex.my-1
    b-input-group.mr-1(prepend="地段"): b-select(
      v-model="section",
      :options="sectionOpts"
    )
    b-input-group(prepend="地號"): b-input(v-model="landNum")
  b-button(@click="search", variant="outline-primary", block) 🔎 搜尋
  hr
  h5 搜尋結果
  CaseList(:list="searchedData", :loading="isBusy", :per-page="10")
</template>

<script>
import isEmpty from 'lodash/isEmpty';

export default {
  emit: ["data-update"],
  head: {
    title: "查詢 BY 案件-界標閱覽系統",
  },
  data: () => {
    const now = new Date();
    const defYear = now.getFullYear() - 1911;
    return {
      year: "",
      maxYear: defYear,
      code: "",
      codeOpts: [],
      num: "",
      section: "",
      sectionOpts: [],
      landNum: "",
      opdate: "",
      searchedData: []
    };
  },
  computed: {
    caseId() {
      return `${this.year}${this.code}${this.num}`;
    },
    formatedLandNum() {
      if (this.landNum.includes("-")) {
        const numbers = this.landNum.split("-");
        const parent = parseInt(numbers[0]);
        const child = parseInt(numbers[1]);
        if (parent > 9999 || parent < 0 || child < 0 || child > 9999) {
          console.warn("地號格式不正確", `${parent}-${child}`);
          return "";
        }
        return ('0000' + parent).slice(-4) + ('0000' + child).slice(-4);
      } else {
        const number = parseInt(this.landNum);
        if (number > 0 && number < 10000) {
          return ('0000' + number).slice(-4) + "0000";
        }
        console.warn("地號格式不正確", `${number}-0000`);
        return "";
      }
    },
    filter() {
      const filter = {};
      !isEmpty(this.year) && (filter.year = ("000" + this.year).slice(-3));
      !isEmpty(this.code) && (filter.code = this.code);
      !isEmpty(this.num) && (filter.num = ("000000" + this.num).slice(-6));
      !isEmpty(this.section) && (filter.section = this.section);
      !isEmpty(this.opdate) && (filter.opdate = this.opdate);
      !isEmpty(this.formatedLandNum) && (filter.lands = { number: this.formatedLandNum});
      return filter;
    }
  },
  created() {
    // codes/sections which is Map structure from global mixin
    this.codeOpts = [{ text: "", value: "" }];
    this.codes.forEach((val, key, map) => {
      this.codeOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
    this.sectionOpts = [{ text: "", value: "" }];
    this.sections.forEach((val, key, map) => {
      this.sectionOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
  },
  mounted() {
    // this.$emit("data-update", { message: "收到案件查詢回傳DATA" });
  },
  methods: {
    search () {
      console.log("搜尋條件", this.filter);
      this.isBusy = true;
      this.searchedData = [];
      this.$axios
        .post("/api/search", this.filter)
        .then(({ data }) => {
          if (Array.isArray(data.payload)) {
            this.success(data.message);
            this.searchedData = [...data.payload];
            this.$store.commit('wipList', this.searchedData);
          } else {
            this.warning(data.message);
          }
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
