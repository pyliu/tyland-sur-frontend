<template lang="pug">
.text-left
  .d-flex.align-items-center(:title="caseId")
    a.mr-2(@click="saveWip") {{ formatedCaseId }}
    b-button.border-0(
      title="顯示詳情",
      size="sm",
      variant="outline-secondary",
      @click="toggleDetail"
    ): b-icon(
      :icon="collapseIcon"
    )
  b-collapse(v-model="detail")
    b-card.text-left
      template(#header): .d-flex.justify-content-between.align-items-center
        .mr-1 {{ sectionCode }} {{ section }}
        div

      h5 TODO: 顯示地號群

      template(#footer): .d-flex.justify-content-between.align-items-center
        .mr-1 {{ creator }}
        div {{ opdate }}
</template>

<script>
export default {
  props: {
    raw: { type: Object, require: true },
  },
  data: () => ({
    detail: false,
  }),
  computed: {
    formatedYear() {
      return ("000" + this.raw.year).slice(-3);
    },
    formatedCode() {
      return ("XXXX" + this.raw.code).slice(-4);
    },
    formatedNum() {
      return ("000000" + this.raw.num).slice(-6);
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
      return this.raw.opdate;
    },
    sectionCode() {
      return this.raw.section;
    },
    section() {
      return this.sections.get(this.raw.section);
    },
    code() {
      return this.codes.get(this.raw.code);
    },
    creator() {
      return this.raw.creator;
    },
    collapseIcon() {
      return this.detail ? "caret-down" : "caret-right";
    },
  },
  methods: {
    saveWip() {
      this.$store.commit("wip", this.raw);
      this.$router.push(`/list/${this.caseId}`);
    },
    toggleDetail(event) {
      event.stopPropagation();
      event.preventDefault();
      this.detail = !this.detail;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
