<template lang="pug">
.d-flex.justify-content-center: img.ml-5(alt="tyland logo" src="./assets/logo.png")
FileUpload
</template>

<script>
import FileUpload from './components/FileUpload.vue'

export default {
  name: 'App',
  head: { title: '界標資料閱覽系統-桃園地政事務所' },
  components: { FileUpload },
  setup () {
    const loggedIn = false
    return {
      loggedIn
    }
  },
  mounted () {
    console.log(this.loggedIn)
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
