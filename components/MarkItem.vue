<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    span(v-if="!detail") 序號 \#{{ markSerial }}
    span(v-if="!detail") 種類 {{ markType }}
    //- span(v-if="!detail") 建立人 {{ markCreator }}
    span 
    //- b-button.p-0.border-0.mx-1(
    //-   v-if="isOwner && !detail",
    //-   size="sm",
    //-   variant="outline-danger",
    //-   @click="$emit('remove', mark)"
    //- ) ❌
    b-button.p-0.border-0(
      title="顯示圖片",
      size="sm",
      variant="outline-secondary",
      @click="toggleDetail"
    ): b-icon(
      :icon="collapseIcon"
    )

  b-collapse.mt-1(v-model="detail")
    b-card.text-left
      template(#header): .d-flex.justify-content-between.align-items-center
        span 序號：\#{{ markSerial }}
        span 種類：{{ markType }}

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
        span 建立人：{{ markCreator }}
        b-button.p-0.border-0.mx-1(
          v-if="isOwner",
          size="sm",
          variant="outline-danger",
          v-b-popover.hover.focus.top="'刪除本界標'",
          @click="removeMark"
        ) ❌
</template>

<script>
import CaseBase from "~/components/CaseBase.js"

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true },
    mark: { type: Object, require: true }
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
    markSerial() {
      return this.mark.serial;
    },
    markType() {
      return this.mark.type;
    },
    markCreator() {
      return this.userMap.get(this.mark.creator) || this.mark.creator;
    }
  },
  created() {
    // console.log(this.raw, this.landNumber, this.creator);
  },
  methods: {
    removeMark() {
      this.confirm(`確認刪除 ${this.landNumber} - #${this.markSerial} 界標資料？`)
      .then((YN) => {
        YN && this.$emit("remove", this.mark);
      });
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
