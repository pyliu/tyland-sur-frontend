<template lang="pug">
b-card
  b-card-title.d-flex.align-items-center
    span.mr-auto 新增案件
    span.small.text-muted {{ this.caseId }}
  b-card-text
    b-input-group(prepend="　　　年"): b-input(
      v-model="year",
      type="number",
      :max="maxYear",
      min="87"
    )
    b-input-group.my-1(prepend="　　　字"): b-select(
      v-model="code",
      :options="codeOpts"
    )
    b-input-group(prepend="　　　號"): b-input(
      v-model="num",
      type="number",
      max="999999",
      min="100",
      step="100"
    )
    b-input-group.my-1(prepend="　　地段"): b-select(
      v-model="section",
      :options="sectionOpts"
    )
    b-input-group(prepend="複丈日期"): b-input(
      v-model="opdate",
      type="date",
      :max="maxOpdate"
    )
    b-button-group.mt-1.d-flex.justify-content-center: b-button(
      variant="primary",
      :disabled="!ok",
      @click="add"
    ) 新增案件
</template>

<script>
import tycode from "~/assets/json/tycode.json";
import tysection from "~/assets/json/tysection.json";
import isEmpty from "lodash/isEmpty";

export default {
  data: () => {
    const codes = [];
    tycode?.forEach((element) => {
      codes.push({
        text: `${element.value} ${element.text}`,
        value: element.value,
      });
    });
    const sections = [];
    tysection?.forEach((element) => {
      sections.push({
        text: `${element.value} ${element.text}`,
        value: element.value,
      });
    });
    const now = new Date();
    const defYear = now.getFullYear() - 1911;
    const today =
      now.getFullYear() +
      "-" +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + now.getDate()).slice(-2);
    return {
      year: defYear,
      maxYear: defYear,
      code: "HA46",
      codeOpts: codes,
      num: "999999",
      section: "",
      sectionOpts: sections,
      opdate: today,
      maxOpdate: today,
    };
  },
  computed: {
    ok() {
      const iYear = parseInt(this.year);
      const iNum = parseInt(this.num);
      return (
        parseInt(iYear) <= this.maxYear && parseInt(iYear) >= 87 &&
        parseInt(iNum) > 0 && parseInt(iNum) < 1000000 &&
        this.notEmpty(this.code) &&
        this.notEmpty(this.section) &&
        this.notEmpty(this.opdate)
      );
    },
    caseId() {
      return `${("000" + this.year).slice(-3)}-${this.code}-${(
        "000000" + this.num
      ).slice(-6)}`;
    },
    rawCaseId() {
      return this.caseId.replaceAll("-", "");
    },
  },
  methods: {
    notEmpty(val) {
      return !isEmpty(val);
    },
    add() {},
  },
};
</script>

<style lang="scss" scoped>
</style>
