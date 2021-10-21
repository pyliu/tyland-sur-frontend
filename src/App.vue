<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "./components/HelloWorld.vue";
const head = '界標閱覽系統-桃園地政事務所'
</script>

<template lang="pug">
div.p-3: img.w-auto(alt="事務所LOGO", src="./assets/logo_removebg.png")
div: HelloWorld(msg="TEST ELEMENT BUTTON")
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
