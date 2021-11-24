<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    div {{ landNumber.substring(0, 4) }}-{{ landNumber.substring(4) }}
    b-button(
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
    b-card.text-left
      template(#header): .d-flex.justify-content-between.align-items-center
        span {{ formatedCaseId }}

      b-carousel#carousel-1(
        v-model="slide",
        :interval="4000",
        controls="",
        indicators="",
        background="#ababab",
        img-width="256",
        img-height="120",
        style="text-shadow: 1px 1px 2px #333",
        @sliding-start="(function () {})()",
        @sliding-end="(function () {})()"
      )
        // Text slides with image
        b-carousel-slide(
          caption="First slide",
          text="Nulla vitae elit libero, a pharetra augue mollis interdum.",
          img-src="https://picsum.photos/1024/480/?image=52"
        )
        // Slides with custom text
        b-carousel-slide(img-src="https://picsum.photos/1024/480/?image=54")
          h1 Hello world!
        // Slides with image only
        b-carousel-slide(img-src="https://picsum.photos/1024/480/?image=58")
        // Slides with img slot
        // Note the classes .d-block and .img-fluid to prevent browser default image alignment
        b-carousel-slide
          template(#img="")
            img.d-block.img-fluid.w-100(
              width="1024",
              height="480",
              src="https://picsum.photos/1024/480/?image=55",
              alt="image slot"
            )
        // Slide with blank fluid image to maintain slide aspect ratio
        b-carousel-slide(
          caption="Blank Image",
          img-blank="",
          img-alt="Blank image"
        )
          p
            | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis, tincidunt
            | a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.

      template(#footer): .d-flex.justify-content-between.align-items-center.text-muted
        span BBB
</template>

<script>
import CaseBase from "~/components/CaseBase.js"

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true }
  },
  mixins: [CaseBase],
  data: () => ({
    detail: false,
    slide: 0,
  }),
  computed: {
    isOwner() {
      return this.creator === this.userId;
    },
    collapseIcon() {
      return this.detail ? "caret-down" : "caret-right";
    },
  },
  created() {
    // console.log(this.raw, this.landNumber, this.creator);
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
