<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    div {{ formatedLandNumber }}
    b-badge.mx-1(variant="secondary", pill, title="界標數") {{ markCount }}
    b-button.border-0(
      v-if="isOwner && markCount === 0",
      size="sm",
      variant="outline-danger",
      :title="`刪除地號 ${formatedLandNumber}`",
      @click="removeLandNumber"
    ) ❌
    b-button.ml-auto.border-0(
      title="顯示詳情",
      size="sm",
      variant="outline-secondary",
      @click="toggleDetail"
    ): b-icon(
      :icon="collapseIcon"
    )

  b-collapse.mt-1(v-model="detail")
    b-card
      template(#header): .d-flex.justify-content-between.align-items-center
        span {{ formatedCaseId }}

      div ...

      template(#footer): .d-flex.justify-content-between.align-items-center.text-muted
        span BBB
</template>

<script>
import CaseBase from "~/components/CaseBase.js"

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true },
    landCreator: { type: String, require: true }
  },
  mixins: [CaseBase],
  data: () => ({
    detail: false,
    slide: 0,
  }),
  computed: {
    isOwner() {
      return this.landCreator === this.userId;
    },
    collapseIcon() {
      return this.detail ? "caret-down" : "caret-right";
    },
    formatedLandNumber() {
      return `${this.landNumber.substring(0, 4)}-${this.landNumber.substring(4)}`;
    },
    markCount() {
      const found = this.raw.lands.find((land, idx, arr) => {
        return land.number === this.landNumber;
      });
      const marks = found?.marks || [];
      return marks.length;
    }
  },
  methods: {
    removeLandNumber() {
      this.$emit("remove", this.landNumber);
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
