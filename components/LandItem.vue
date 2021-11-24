<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    .mr-auto {{ landNumber.substring(0, 4) }}-{{ landNumber.substring(4) }}
    b-button.mr-2(
      v-if="isOwner",
      size="sm",
      variant="outline-danger",
      @click="removeLandNumber"
    ) ❌
    b-button.border-0(
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
  },
  created() {
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
