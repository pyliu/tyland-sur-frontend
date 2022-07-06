<template lang="pug">
div
    h6 {{ imageTitle }}
    b-input-group.my-1
      b-file(
        v-model="uploadFile",
        placeholder="選擇 JPG 檔",
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
    b-img.mt-2.mx-auto.shadow(
      v-else-if="uploadFileOK && uploadFileBlob"
      :src="uploadFileBlobUrl"
      thumbnail
      fluid
      block
    )
    .d-flex.justify-content-center.align-items-center.mt-1(v-if="uploadFileOK && uploadFileBlob")
      b-button(
        variant="primary",
        @click="sendRaw ? uploadRaw() : uploadResized()",
        :disabled="isBusy"
      ) 更新{{ imageTitle }}
      //- b-checkbox.ml-1(v-model="sendRaw", size="sm") 原始檔 {{ uploadFileRawSize }}

    a(v-if="!uploadFileOK", href="#", @click="openInNewWindow(previewImg)"): b-img.mx-auto.shadow(
      :src="previewImg"
      thumbnail
      fluid
      block
    )
    
</template>

<script>
import Pica from "pica";
import Reducer from "image-blob-reduce";
export default {
  props: {
    mark: { type: Object, require: true },
    type: { type: String, default: 'far' }  // far or near
  },
  data: () => ({
    ts: +new Date(),
    sendRaw: false,
    uploadFile: undefined,
    uploadFileBlob: undefined,
    supportTypes: ["image/jpeg" /*, 'image/png', 'image/gif'*/]
  }),
  computed: {
    section() {
      return this.mark.section;
    },
    opdate() {
      return this.mark.opdate;
    },
    number() {
      // land number 
      return this.mark.number;
    },
    creator() {
      this.mark.creator;
    },
    markSerial() {
      return this.mark.serial;
    },
    markType() {
      return this.mark.type;
    },
    caseYear() {
      return this.mark.year;
    },
    caseCode() {
      return this.mark.code;
    },
    caseNum() {
      return this.mark.num;
    },
    caseId() {
      return `${this.caseYear}-${this.caseCode}-${this.caseNum}`
    },
    distance() {
      return this.type;
    },
    basicImgPath() {
      return `/mark/${this.caseId}/${this.section}/${this.opdate}/${this.number}/${this.markSerial}`;
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
    uploadUrl() {
      return `${this.basicImgPath}/${this.distance}`;
    },
    uploadFileOK() {
      return Boolean(this.uploadFile);
    },
    imageTitle() {
      return `${this.distance === "far" ? "第1張" : "第2張"}`;
    },
    uploadFileBlobUrl() {
      return URL.createObjectURL(this.uploadFileBlob);
    },
    uploadFileRawSize() {
      if (!this.uploadFile) {
        return "";
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
        // https://github.com/nodeca/image-blob-reduce/issues/17#issuecomment-751550135
        // to fix production issue for toBlob function produces "referenceError: h is not defined" error
        const pica = Pica({ features: ["js", "wasm", "cib"] });
        const reducer = new Reducer({ pica });
        reducer.toBlob(this.uploadFile, {
          max: 720,  // max dimension is 720 x 720 pixels
          unsharpAmount: 75,
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
    clearUploading() {
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
                title: "上傳界標圖檔(RAW)成功",
                subtitle: this.imageTitle,
              });
            } else {
              this.warning(data.message, { title: "上傳界標圖檔(RAW)失敗" });
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
                subtitle: this.imageTitle,
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
  }
};
</script>

<style lang="scss" scoped>
</style>
