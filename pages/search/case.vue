<template lang="pug">
div
  b-input-group(prepend="　年"): b-input(
    v-model="year",
    type="number",
    :max="maxYear",
    min="87",
    :state="yearOK"
  )
  b-input-group.my-1(prepend="　字"): b-select(v-model="code", :options="codeOpts")
  b-input-group(prepend="　號"): b-input(
    v-model="num",
    type="number",
    max="999999",
    min="100",
    step="100",
    :state="numOK"
  )
  .d-flex.my-1
    b-input-group.mr-1(prepend="地段"): b-select(
      v-model="section",
      :options="sectionOpts"
      v-b-popover.focus.top="sections.get(section)"
    )
    b-input-group(prepend="地號"): b-input(v-model="landNum", :state="landOK", v-b-popover.focus.top="formatedLandNum")
  .d-flex.justify-content-center.mt-2
    b-button.mr-2(@click="search", variant="outline-primary", :disabled="isBusy", pill) 🔎 搜尋
    b-button(@click="clear", variant="outline-secondary", :disabled="isBusy", pill) 🗑 清除
  hr
  h5 搜尋結果
  CaseList(:list="searchedData", :loading="isBusy", :per-page="10")
</template>

<script>
import isEmpty from 'lodash/isEmpty';

export default {
  emit: ["data-update"],
  head: {
    title: "查詢案件資料-界標即可拍系統",
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
    yearOK() {
      if (isEmpty(this.year)) {
        return null;
      }
      const iYear = parseInt(this.year);
      return iYear >= 87 && iYear <= this.maxYear;
    },
    numOK() {
      if (isEmpty(this.num)) {
        return null;
      }
      const iNum = parseInt(this.num);
      return iNum > 0 && iNum < 1000000;
    },
    landOK() {
      if (isEmpty(this.landNum)) {
        return null;
      }
      return !isEmpty(this.formatedLandNum);
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
      }
      if (isEmpty(this.landNum)) {
        return "";
      }
      if (this.landNum.length <= 4) {
        return ('0000' + this.landNum).slice(-4) + "0000";
      }
      console.warn("地號格式不正確", this.landNum);
      return "";
    },
    filter() {
      const filter = {};
      !isEmpty(this.year) && (filter.year = ("000" + this.year).slice(-3));
      if (isEmpty(this.code) || (this.code?.startsWith('^') && this.code !== `^${this.site}`)) {
        filter.code = `^${this.site}`;
      } else {
        filter.code = this.code;
      }
      !isEmpty(this.num) && (filter.num = ("000000" + this.num).slice(-6));
      !isEmpty(this.section) && (filter.section = this.section);
      !isEmpty(this.opdate) && (filter.opdate = this.opdate);
      !isEmpty(this.formatedLandNum) && (filter["lands.number"] = this.formatedLandNum);
      return filter;
    }
  },
  watch: {
    year(val) {
      this.setCache('search_case_year', val);
    },
    code(val) {
      this.setCache('search_case_code', val);
    },
    num(val) {
      this.setCache('search_case_num', val);
    },
    section(val) {
      this.setCache('search_case_section', val);
    },
    landNum(val) {
      this.setCache('search_case_landNum', val);
    },
    opdate(val) {
      this.setCache('search_case_opdate', val);
    }
  },
  async created() {
    // codes/sections which is Map structure from global mixin
    this.codeOpts = [{ text: "", value: `^${this.site}` }];
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
    this.year = await this.getCache('search_case_year') || "";
    this.code = await this.getCache('search_case_code') || `^${this.site}`;
    this.num = await this.getCache('search_case_num') || "";
    this.section = await this.getCache('search_case_section') || "";
    this.landNum = await this.getCache('search_case_landNum') || "";
    this.opdate = await this.getCache('search_case_opdate') || "";
    this.searchedData = [...this.wipList];
  },
  beforeDestroy() {
    // this.$emit("data-update", { message: "收到案件查詢回傳DATA" });
    // this.$store.commit('wipList', []);
  },
  methods: {
    search() {
      console.log("搜尋條件", this.filter);
      this.isBusy = true;
      this.searchedData = [];
      this.$axios
        .post("/api/search/case", this.filter)
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
    },
    clear() {
      this.removeCache('search_case_year');
      this.removeCache('search_case_code');
      this.removeCache('search_case_num');
      this.removeCache('search_case_section');
      this.removeCache('search_case_landNum');
      this.removeCache('search_case_opdate');
      this.year = "";
      this.code = "";
      this.num = "";
      this.section = "";
      this.landNum = "";
      this.opdate = "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
