<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    div {{ formatedLandNumber }}
    b-badge.mx-1(variant="secondary", pill, title="界標數") {{ markCount }}
    b-button.border-0.p-0(
      v-if="isOwner && markCount === 0",
      size="sm",
      variant="outline-danger",
      :title="`刪除地號 ${formatedLandNumber}`",
      @click="removeLandNumber"
    ) ❌
    b-button.ml-auto(
      size="sm",
      variant="outline-primary",
      :title="`在地號 ${formatedLandNumber} 裡新增界標`",
      v-b-modal="addMarkModalId"
    ) 新增界標
  b-modal(
    ref="add-mark-modal"
    :id="addMarkModalId"
    :title="`新增界標 - ${formatedLandNumber}`"
    centered
  )
    span TODO ...
    template(#modal-footer="{ ok, cancel, hide }")
      b-button(
        @click="addMark",
        :variant="addBtnDisabled ? 'outline-secondary' : 'primary'"
        :disabled="addBtnDisabled"
      ) 確認
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
    addMarkModalId: ""
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
    },
    addBtnDisabled() {
      return false;
    }
  },
  created() {
    this.addMarkModalId = this.uuid();
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
    addMark() {
      this.$refs["add-mark-modal"].hide();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
