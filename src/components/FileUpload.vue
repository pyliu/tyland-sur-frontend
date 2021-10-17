<template lang="pug">
.file-upload
  span(v-if="progress !== 0") {{ progress }}
  input(type="file" @change="onFileChange")
  .flex-1
    TylandButton(@click="onUploadFile" :disabled="!this.selectedFile") 上傳
    TylandButton(@click="this.selectedFile = null" variant="secondary") 取消
</template>

<script>
import axios from "axios"
import TylandButton from './TylandButton.vue'

export default {
  components: { TylandButton },
  data: () => ({
    selectedFile: undefined,
    progress: 0
  }),
  methods: {
    onFileChange (e) {
      const selectedFile = e.target.files[0] // accessing file
      this.selectedFile = selectedFile
    },
    onUploadFile () {
      const formData = new FormData()
      formData.append("file", this.selectedFile)  // appending file

     // sending file to the backend
      axios
        .post("http://localhost:4500/upload", formData, {
          onUploadProgress: ProgressEvent => {
            let progress =
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
              +"%"
            this.progress = progress
          }
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setTimeout(() => (this.progress = 0), 1000)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload {
  box-shadow: 2px 2px 9px 2px #ccc;
  border-radius: 1rem;
  padding: 2rem;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  font-size: 1rem;
  width: 95%;
  margin: 0 auto;
}

input {
  font-size: 0.9rem;
}

input, div, button {
  margin-top: 1rem;
}
</style>
