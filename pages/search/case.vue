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
  b-button(variant="outline-primary", block) 🔎 搜尋
  hr
  h5 搜尋結果
  CaseList(:list="searchedData", :loading="isBusy", :per-page="10")
</template>

<script>
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
  },
  created() {
    this.opdate = this.today;
    this.codeOpts = [{ text: "", value: "" }];
    this.codes.forEach((element) => {
      this.codeOpts.push({
        text: `${element.value} ${element.text}`,
        value: element.value,
      });
    });
    this.sectionOpts = [{ text: "", value: "" }];
    this.sections.forEach((element) => {
      this.sectionOpts.push({
        text: `${element.value} ${element.text}`,
        value: element.value,
      });
    });
  },
  mounted() {
    // this.$emit("data-update", { message: "收到案件查詢回傳DATA" });
  },
};
</script>

<style lang="scss" scoped>
</style>
