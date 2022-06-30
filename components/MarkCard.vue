<template lang="pug">
.text-left
  b-card.text-left(
    ref="card-detail",
    header-bg-variant="secondary",
    header-text-variant="white"
  )
    template(#header): .d-flex.justify-content-between.align-items-center
      span 編號：\#{{ markSerial }}
      span 種類：{{ markType }}

    h5 📸 第1張
    a(href="#", @click="openInNewWindow(farImg)"): b-img-lazy.mx-auto.shadow(
      title="點擊開新視窗顯示",
      :src="farImg",
      thumbnail,
      fluid,
      block
    )
    hr
    h5 📸 第2張
    a(href="#", @click="openInNewWindow(nearImg)"): b-img-lazy.mx-auto.shadow(
      title="點擊開新視窗顯示",
      :src="nearImg",
      thumbnail,
      fluid,
      block
    )

    template(#footer): .d-flex.justify-content-between.align-items-center.text-muted
      span 上傳者：{{ markCreator }}
      span 地號：{{ formatedLandNumber }}
</template>

<script>
export default {
  props: {
    raw: { type: Object, require: true },
  },
  data: () => ({
    ts: +new Date(),
  }),
  computed: {
    isOwner() {
      return this.creator === this.userId;
    },
    formatedLandNumber() {
      return `${this.raw?.number?.substring(
        0,
        4
      )}-${this.raw?.number?.substring(4)}`;
    },
    markSerial() {
      return this.raw?.serial;
    },
    markType() {
      return this.raw?.type;
    },
    markCreator() {
      return this.userMap.get(this.raw?.creator) || this.raw?.creator;
    },
    markCaption() {
      return `序號：${this.markSerial} / 形式：${this.markType} / 上傳：${this.markCreator}`;
    },
    caseId() {
      return `${this.raw?.year}-${this.raw?.code}-${this.raw?.num}`;
    },
    basicImgPath() {
      return `/mark/${this.caseId}/${this.raw?.section}/${this.raw?.opdate}/${this.raw?.number}/${this.markSerial}`;
    },
    farImg() {
      // return `${this.basicImgPath}/far?ts=${this.ts}`;
      return `${this.basicImgPath}/far`;
    },
    nearImg() {
      // return `${this.basicImgPath}/near?ts=${this.ts}`;
      return `${this.basicImgPath}/near`;
    },
    subtitle() {
      return `#${this.markSerial} / ${this.markType}`;
    },
  },
  watch: {},
  methods: {
    openInNewWindow(src) {
      window.open(src, "_blank", "noopener");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
