<template lang="pug">
button(@click="isShowing = !isShowing") 切換
.p-6.max-w-sm.mx-auto.bg-white.rounded-xl.shadow-md.flex.items-center.space-x-4(v-if="isShowing")
  div
    .text-xl.font-bold.text-red-900 訊息
    p.text-gray-500 你有新訊息！

div(class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6")
  img(class="block mx-auto h-12 rounded-full sm:mx-0 sm:flex-shrink-0" src="./assets/avatar-user.svg" alt="Woman's Face")
  div(class="text-center space-y-2 sm:text-left")
    div(class="space-y-0.5")
      p(class="text-lg text-black font-semibold") Erin Lindford
      p(class="text-gray-500 font-medium") Product Engineer
    button(class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2") Message

img(alt="tyland logo" src="./assets/logo.png")
FileUpload
</template>

<script>
// import { ref } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import FileUpload from './components/FileUpload.vue'

export default {
  name: 'App',
  head: { title: '界標資料閱覽系統-桃園地政事務所' },
  components: { FileUpload, TransitionRoot },
  data: () => ({
    isShowing: false
  })
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
