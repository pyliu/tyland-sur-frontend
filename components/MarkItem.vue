<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    h6(v-if="!detail") 📸\#{{ markSerial }}
    span(v-if="!detail") {{ markType }}
    b-button.p-1.border-0.mx-1(
      v-if="isOwner",
      size="sm",
      variant="outline-primary",
      @click="$refs['upload-modal'].show()"
    )
      b-icon.mr-1(icon="upload")
      span 上傳
    b-button.p-1.border-0(size="sm", variant="outline-secondary", @click="toggleDetail")
      b-icon.mr-1(:icon="collapseIcon")
      span {{ detail ? '收起' : '查看' }}

  b-collapse.mt-1(
    v-model="detail"
    @shown="$refs['card-detail'].scrollIntoView({ behavior: 'smooth' })"
  )
    b-card.text-left(
      ref="card-detail"
      header-bg-variant="secondary"
      header-text-variant="white"
    )
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
          content-visible-up="sm",
          caption-tag="h3",
          :caption="markCaption"
        ): template(#img)
          b-img(
            class="d-block img-thumbnail img-fluid w-100"
            :src="nearImg"
            @click="openInNewWindow(farImg)"
          )
        b-carousel-slide(
          text="近距離",
          text-tag="h4",
          content-visible-up="sm",
          caption-tag="h3",
          :caption="markCaption"
        ): template(#img)
          b-img(
            class="d-block img-thumbnail img-fluid w-100"
            :src="nearImg"
            @click="openInNewWindow(nearImg)"
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
    b-input-group(prepend="分類"): b-select(
      v-model="distance",
      :options="distanceOpts"
    )
    b-input-group.my-1(prepend="檔案")
      b-file(
        v-model="uploadFile",
        placeholder="請選擇圖檔",
        browse-text="瀏覽",
        :accept="supportTypes.join(',')"
      ): template(
        slot="file-name",
        slot-scope="{ names }"
      ): b-badge(
        variant="primary"
      ) {{ names[0] }}
      b-button.ml-1(
        v-if="uploadFileOK",
        variant="outline-primary",
        @click="upload",
        :disabled="isBusy"
      ) 上傳
</template>

<script>
import CaseBase from "~/components/CaseBase.js";

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true },
    mark: { type: Object, require: true },
  },
  mixins: [CaseBase],
  data: () => ({
    detail: false,
    slide: 0,
    ts: +new Date(),
    uploadFile: undefined,
    supportTypes: ["image/*" /*, 'image/png', 'image/gif'*/],
    distance: "far",
    distanceOpts: [
      { text: "遠距離", value: "far" },
      { text: "近距離", value: "near" },
    ],
  }),
  computed: {
    isOwner() {
      return this.creator === this.userId;
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
      return `/mark/${this.caseId}/${this.sectionCode}/${this.opdate}/${this.markSerial}`;
    },
    farImg() {
      return `${this.basicImgPath}/far?ts=${this.ts}`;
    },
    nearImg() {
      return `${this.basicImgPath}/near?ts=${this.ts}`;
    },
    uploadUrl() {
      return `${this.basicImgPath}/${this.distance}`;
    },
    uploadFileOK() {
      return Boolean(this.uploadFile);
    },
    subtitle() {
      return `#${this.markSerial} / ${this.markType} / ${
        this.distance === "far" ? "遠" : "近"
      }`;
    },
  },
  watch: {
    uploadFile(val) {

    }
  },
  methods: {
    openInNewWindow(src) {
      console.log(src)
      window.open(src, '_blank').focus();
    },
    removeMark() {
      this.confirm(
        `確認刪除 ${this.landNumber} - #${this.markSerial} 界標資料？`
      ).then((YN) => {
        YN && this.$emit("remove", this.mark);
      });
    },
    toggleDetail(event) {
      event.stopPropagation();
      event.preventDefault();
      this.detail = !this.detail;
    },
    upload() {
      const type = this.uploadFile?.type;
      if (this.supportTypes.includes(type)) {
        this.isBusy = true;
        const formData = new FormData();
        formData.append("file", this.uploadFile);
        formData.append("width", 1920);
        formData.append("height", 1080);
        formData.append("quality", 80);
        this.$axios
          .post(this.uploadUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => {
            if (this.statusCode.SUCCESS === data.statusCode) {
              this.success(data.message, {
                title: "上傳界標圖檔",
                subtitle: this.subtitle,
              });
            } else {
              this.warning(data.message, { title: "上傳界標圖檔" });
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.$refs["upload-modal"].hide();
            this.ts = +new Date();
            this.isBusy = false;
            this.uploadFile = undefined;
          });
      } else {
        this.warning("僅支援 JPG 圖檔上傳");
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
