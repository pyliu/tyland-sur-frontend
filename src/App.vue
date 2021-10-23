<script setup>
// https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref, watchEffect } from 'vue'
import localforage from 'localforage'

const loggedin = ref(false)

</script>

<template lang="pug">
div.p-5: img.w-auto(alt="事務所LOGO", src="./assets/logo_removebg.png")
router-view
//- div: Login(msg="TEST ELEMENT BUTTON")
</template>

<script>
export default {
  async created () {
    this.loggedin = await localforage.getItem('session')
    if (this.loggedin) {
      this.$router.push('/about')
    } else {
      this.$router.push('/')
    }
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
