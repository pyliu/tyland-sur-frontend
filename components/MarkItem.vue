<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    h6(v-if="!detail") 📸\#{{ markSerial }}
    span(v-if="!detail") {{ markType }}
    b-button.p-1.border-0.mx-1(
      v-if="isOwner",
      size="sm",
      variant="outline-primary",
      @click="showModal"
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
            :src="farImg"
            @click="openInNewWindow(farImg)"
            thumbnail
            fluid
            block
          )
        b-carousel-slide(
          text="近距離",
          text-tag="h4",
          content-visible-up="sm",
          caption-tag="h3",
          :caption="markCaption"
        ): template(#img)
          b-img(
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
    b-input-group(prepend="分類"): b-select(
      v-model="distance",
      :options="distanceOpts"
    )
    b-input-group.my-1(prepend="檔案")
      b-file(
        v-model="uploadFile",
        placeholder="請選擇 JPG 圖檔",
        browse-text="瀏覽",
        :accept="supportTypes.join(',')"
      ): template(
        slot="file-name",
        slot-scope="{ names }"
      ): b-badge(
        variant="primary"
      ) {{ names[0] }}
    
    .text-center.mt-2(v-if="uploadFileOK && !uploadFileBlob")
      b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="2")
    b-img.mt-2.mx-auto(
      v-else-if="uploadFileOK && uploadFileBlob"
      :src="uploadFileBlobUrl"
      thumbnail
      fluid
      block
    )
    .d-flex.justify-content-center.align-items-center(v-if="uploadFileOK && uploadFileBlob")
      b-button(
        variant="primary",
        @click="sendRaw ? uploadRaw() : uploadResized()",
        :disabled="isBusy"
      ) 上傳
      b-checkbox.ml-1(v-model="sendRaw", size="sm") 原始檔 {{ uploadFileRawSize }}
</template>

<script>
import CaseBase from "~/components/CaseBase.js";
import Reducer from "image-blob-reduce";

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true },
    mark: { type: Object, require: true },
  },
  mixins: [CaseBase],
  data: () => ({
    sendRaw: false,
    detail: false,
    slide: 0,
    ts: +new Date(),
    uploadFile: undefined,
    uploadFileBlob: undefined,
    supportTypes: ["image/jpeg" /*, 'image/png', 'image/gif'*/],
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
    uploadFileBlobUrl() {
      return URL.createObjectURL(this.uploadFileBlob);
    },
    uploadFileRawSize() {
      if (!this.uploadFile) {
        teturn "";
      }
      const KB = (this.uploadFile?.size / 1024.0 || 0).toFixed(2);
      if (KB < 1000) {
        return `${KB} KB`;
      }
      const MB = (KB /1024.0).toFixed(2);
      return `${MB} MB`;
    }
  },
  watch: {
    uploadFile(val) {
      if (val) {
        const reducer = Reducer();
        reducer.toBlob(val, {
          max: 1920,  // max dimension is 1920 x 1920 pixels
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
        }).then((blob) => {
          // this.uploadFileBlob = URL.createObjectURL(blob);
          this.uploadFileBlob = blob;
        }).catch((err) => {
          console.error(err);
          this.uploadFileBlob = undefined;
        });
      } else {
        this.uploadFileBlob = undefined;
      }
    }
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
    clearUploading() {
      this.$refs["upload-modal"].hide();
      this.ts = +new Date();
      this.isBusy = false;
      this.uploadFile = undefined;
      this.uploadFileBlob = undefined;
      this.sendRaw = false;
    },
    uploadRaw() {
      if (this.uploadFile) {
        this.isBusy = true;
        const headers = {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${this.userTokenHash}`
        };
        const formData = new FormData();
        // formData.append("file", URL.createObjectURL(blob));
        formData.append("file", this.uploadFile);
        this.$axios
          .post(this.uploadUrl, formData, { headers: headers })
          .then(({ data }) => {
            if (this.statusCode.SUCCESS === data.statusCode) {
              this.success(data.message, {
                title: "上傳界標圖檔成功",
                subtitle: this.subtitle,
              });
            } else {
              this.warning(data.message, { title: "上傳界標圖檔失敗" });
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.clearUploading();
          });
      }
    },
    base64Encoded(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(blob);
      });
    },
    uploadResized() {
      this.base64Encoded(this.uploadFileBlob).then((b64) => {
        this.isBusy = true;
        this.$axios
          .put(this.uploadUrl, { b64 })
          .then(({ data }) => {
            if (this.statusCode.SUCCESS === data.statusCode) {
              this.success(data.message, {
                title: "上傳界標圖檔成功",
                subtitle: this.subtitle,
              });
            } else {
              this.warning(data.message, { title: "上傳界標圖檔失敗" });
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.clearUploading();
          });


      }).catch((err) => {
        console.error(err);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
