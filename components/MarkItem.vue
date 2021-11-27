<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    span(v-if="!detail") 📸\#{{ markSerial }}
    span(v-if="!detail") {{ markType }}
    //- span(v-if="!detail") {{ markCreator }}
    span 
    //- b-button.p-0.border-0.mx-1(
    //-   v-if="isOwner && !detail",
    //-   size="sm",
    //-   variant="outline-danger",
    //-   @click="$emit('remove', mark)"
    //- ) ❌
    .d-flex(
      v-b-tooltip="'切換顯示'",
      @click="toggleDetail"
    )
      a(href="#").mr-1 {{ detail ? "收起" : "查看" }}
      b-button.p-0.border-0(
        size="sm",
        variant="outline-secondary"
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
        style="text-shadow: 3px 3px 4px #333",
        @sliding-start="(function () {})()",
        @sliding-end="(function () {})()"
      )
        b-carousel-slide(
          text="遠距離",
          text-tag="h4",
          content-visible-up="md",
          caption-tag="h3",
          :caption="markCaption",
          :img-src="farImg"
        )
        b-carousel-slide(
          text="近距離",
          text-tag="h4",
          content-visible-up="md",
          caption-tag="h3",
          :caption="markCaption",
          :img-src="nearImg"
        )

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
      return this.detail ? "caret-up" : "caret-down";
    },
    markSerial() {
      return this.mark.serial;
    },
    markType() {
      return this.mark.type;
    },
    markCreator() {
      return this.userMap.get(this.mark.creator) || this.mark.creator;
    },
    markCaption() {
      return `序號：${this.markSerial} / 形式：${this.markType} / 上傳：${this.markCreator}`;
    },
    basicImgPath() {
      return `/mark/${this.caseId}/${this.sectionCode}/${this.opdate}/${this.markSerial}`;
    },
    farImg() {
      return `${this.basicImgPath}/far`;
    },
    nearImg() {
      return `${this.basicImgPath}/near`;
    }
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
