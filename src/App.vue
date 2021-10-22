<script setup>
// https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref, watchEffect } from 'vue'
import localforage from 'localforage'
import Login from "./components/Login.vue"

const loggedin = ref(false)
watchEffect(() => console.log(loggedin.value))
// -> logs false

setTimeout(() => {
  loggedin.value = true
  // -> logs true
}, 1000)
</script>

<template lang="pug">
div.p-3: img.w-auto(alt="事務所LOGO", src="./assets/logo_removebg.png")
div: Login(msg="TEST ELEMENT BUTTON")
</template>

<script>
export default {
  async created () {
    console.log(this.loggedin)
  },
  async mounted () {
    this.loggedin = await localforage.getItem('session')
    console.log(this.loggedin)
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
