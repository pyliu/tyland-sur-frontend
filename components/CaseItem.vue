<template lang="pug">
.text-left
  .d-flex.align-items-center.justify-content-between(
    v-if="!card"
    :title="caseId"
  )
    a.link(@click="saveWip") {{ formatedCaseId }}

    span(v-if="!detail") {{ section }}
    span(v-if="!detail") {{ opdate }}
    span(v-if="!detail") {{ creator }}

    b-button.border-0.ml-auto(
      title="顯示詳情",
      size="sm",
      variant="outline-secondary",
      @click="toggleDetail"
    ): b-icon(
      :icon="collapseIcon"
    )
  b-collapse.mt-1(v-model="detail")
    b-card.text-left
      template(#header): .d-flex.justify-content-between.align-items-center.small
        strong(v-b-popover.focus.hover.top="formatedCaseId") {{ caseId }}
        strong(v-b-popover.focus.hover.top="sectionCode") {{ section }}

      b-carousel#carousel-1(v-model="slide" :interval="4000" controls="" indicators="" background="#ababab" img-width="256" img-height="120" style="text-shadow: 1px 1px 2px #333;" @sliding-start="(function(){})()" @sliding-end="(function(){})()")
        // Text slides with image
        b-carousel-slide(caption="First slide" text="Nulla vitae elit libero, a pharetra augue mollis interdum." img-src="https://picsum.photos/1024/480/?image=52")
        // Slides with custom text
        b-carousel-slide(img-src="https://picsum.photos/1024/480/?image=54")
          h1 Hello world!
        // Slides with image only
        b-carousel-slide(img-src="https://picsum.photos/1024/480/?image=58")
        // Slides with img slot
        // Note the classes .d-block and .img-fluid to prevent browser default image alignment
        b-carousel-slide
          template(#img="")
            img.d-block.img-fluid.w-100(width="1024" height="480" src="https://picsum.photos/1024/480/?image=55" alt="image slot")
        // Slide with blank fluid image to maintain slide aspect ratio
        b-carousel-slide(caption="Blank Image" img-blank="" img-alt="Blank image")
          p
            | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis, tincidunt
            | a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.

      template(#footer): .d-flex.justify-content-between.align-items-center.text-muted.small
        strong(v-b-popover.focus.hover.top="'立案人'") {{ creator }}
        strong(v-b-popover.focus.hover.top="'複丈日期'") {{ opdate }}
</template>

<script>
export default {
  props: {
    raw: { type: Object, require: true },
    card: { type: Boolean, default: false }
  },
  data: () => ({
    detail: false,
    slide: 0,
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
  created() {
    this.detail = this.card;
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
