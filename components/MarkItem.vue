<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    h6.clickable(@click="popupPhoto", v-b-tooltip="'彈出查看界標圖片'")
      span 📸\#{{ markSerial }}
    .clickable(@click="toggleDetail", v-b-tooltip="detail ? '收起內嵌界標圖片' : '查看內嵌界標圖片'") {{ markType }}
    b-button-group(size="sm")
      b-button.p-1.border-0(
        v-if="isOwner",
        variant="outline-primary",
        @click="showModal"
        title="上傳圖片"
      ): b-icon(icon="upload")
      b-button.p-1.border-0(
        variant="outline-secondary",
        @click="toggleDetail",
        :title="detail ? '收起內嵌界標圖片' : '查看內嵌界標圖片'"
      ): b-icon(:icon="collapseIcon")

  b-collapse.mt-1(
    v-model="detail"
    @shown="$refs['card-detail'].scrollIntoView({ behavior: 'smooth' })"
  )
    b-card.text-left(
      v-if="detail"
      ref="card-detail"
      header-bg-variant="secondary"
      header-text-variant="white"
    )
      template(#header): .d-flex.justify-content-between.align-items-center
        span 序號：\#{{ markSerial }}
        span {{ slide === 1 ? "第2張" : "第1張"}}
        span 種類：{{ markType }}

      b-carousel#carousel-1(
        v-model="slide",
        controls,
        indicators,
        background="#ababab",
        img-width="256",
        img-height="120",
        :interval="slideInterval",
        style="text-shadow: 3px 3px 4px #333",
        @sliding-start="(function () {})()",
        @sliding-end="(function () {})()"
      )
        b-carousel-slide(
          text="第1張",
          text-tag="h4",
          content-visible-up="sm",
          caption-tag="h3",
          :caption="markCaption",
          :img-alt="farImgAlt",
          img-blank
        ): template(#img)
          a(href="#",  @click="openInNewWindow(farImg)"): b-img-lazy.mx-auto(
            title="點擊開新視窗顯示"
            :src="farImg"
            thumbnail
            fluid
            block
          )
        b-carousel-slide(
          text="第2張",
          text-tag="h4",
          content-visible-up="sm",
          caption-tag="h3",
          :caption="markCaption",
          :img-alt="nearImgAlt",
          img-blank
        ): template(#img)
          a(href="#",  @click="openInNewWindow(nearImg)"): b-img-lazy.mx-auto(
            title="點擊開新視窗顯示"
            :src="nearImg"
            @click="openInNewWindow(nearImg)"
            thumbnail
            fluid
            block
          )

      template(#footer): .d-flex.justify-content-between.align-items-center.text-muted
        span 上傳者：{{ markCreator }}
        b-button.p-0.border-0.mx-1(
          v-if="isOwner",
          size="sm",
          variant="outline-danger",
          v-b-popover.hover.focus.top="'刪除本界標'",
          @click="removeMark"
        ) ❌

  b-modal(
    ref="upload-modal",
    :title="`地號：${formatedLandNumber} #${markSerial} ${markType}`",
    hide-footer,
    centered
  )
    b-row
      b-col: UploadImage(:mark="mark", type="far")
      b-col: UploadImage(:mark="mark", type="near")
</template>

<script>
import CaseBase from "~/components/CaseBase.js";
import MarkCard from "~/components/MarkCard.vue";

export default {
  emit: ["remove"],
  components: { MarkCard },
  props: {
    landNumber: { type: String, require: true },
    mark: { type: Object, require: true },
    open: { type: Boolean, require: true }
  },
  mixins: [CaseBase],
  data: () => ({
    sendRaw: false,
    detail: false,
    slide: 0,
    slideInterval: 5000,
    ts: +new Date()
  }),
  computed: {
    marks() {
      const found = this.raw.lands?.find((land, idx, arr) => {
        return land.number === this.landNumber;
      });
      return found?.marks;
    },
    markIdx() {
      let foundIdx = -1;
      this.marks?.find((mark, idx, arr) => {
        const found = mark.serial === this.markSerial;
        if (found) {
          foundIdx = idx;
        }
        return found;
      });
      return foundIdx;
    },
    landIdx() {
      let foundIdx = -1;
      this.raw.lands?.find((land, idx, arr) => {
        const found = land.number === this.landNumber;
        if (found) {
          foundIdx = idx;
        }
        return found;
      });
      return foundIdx;
    },
    isOwner() {
      return this.mark.creator === this.userId;
    },
    collapseIcon() {
      return this.detail ? "caret-up" : "caret-down";
    },
    formatedLandNumber() {
      return `${this.landNumber.substring(0, 4)}-${this.landNumber.substring(4)}`
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
      return `/mark/${this.caseId}/${this.sectionCode}/${this.opdate}/${this.mark?.number || this.landNumber}/${this.markSerial}`;
    },
    previewImg() {
      return `${this.basicImgPath}/${this.distance}?ts=${this.ts}`;
    },
    farImg() {
      // return `${this.basicImgPath}/far?ts=${this.ts}`;
      return `${this.basicImgPath}/far`;
    },
    nearImg() {
      // return `${this.basicImgPath}/near?ts=${this.ts}`;
      return `${this.basicImgPath}/near`;
    },
    farImgAlt() {
      return `#${this.markSerial} - ${this.markType} - 第1張`
    },
    nearImgAlt() {
      return `#${this.markSerial} - ${this.markType} - 第2張`
    },
    subtitle() {
      return `#${this.markSerial} / ${this.markType} / ${
        this.distance === "far" ? "第1張" : "第2張"
      }`;
    },
  },
  watch: {
    open(flag) {
      this.detail = flag;
    }
  },
  created() {
    this.detail = this.open;
  },
  methods: {
    openInNewWindow(src) {
      window.open(src, '_blank', 'noopener');
    },
    showModal() {
      this.isBusy = false;
      this.uploadFile = undefined;
      this.uploadFileBlob = undefined;
      this.$refs['upload-modal']?.show();
    },
    deleteMarkImages() {
      this.$axios
        .delete(`/api/${this.caseId}/${this.sectionCode}/${this.opdate}/${this.mark?.number || this.landNumber}/${this.markSerial}`)
        .then(({ data }) => {
          if (data.statusCode === this.statusCode.SUCCESS) {
            console.log(this.caseId, data.message);
          } else {
            this.warning(data.message, { subtitle: this.queryCaseId });
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
        });
    },
    removeMark() {
      this.confirm(
        `確認刪除 ${this.landNumber} - #${this.markSerial} 界標資料(此動作無法復原)？`
      ).then((YN) => {
        // YN && this.$emit("remove", this.mark);
        if (YN) {
          this.$emit("remove", this.mark);
          this.deleteMarkImages();
        }
      });
    },
    toggleDetail(event) {
      event.stopPropagation();
      event.preventDefault();
      this.detail = !this.detail;
    },
    popupPhoto() {
      this.modal(this.$createElement(MarkCard, {
        props: { raw: this.mark }
      }), {
        title: `界標圖片 - ${this.section}`,
        size: "xl"
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
