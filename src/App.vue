<template lang="pug">
section.p-5: img.w-auto.mx-auto(alt="事務所LOGO", src="./assets/logo_removebg.png")
router-view
</template>

<script>
import { ref, watchEffect } from "vue";
import localforage from "localforage";
export default {
  setup () {
    const loggedin = ref(false);
    return {
      loggedin
    }
  },
  async created() {
    this.loggedin = await localforage.getItem("session");
    if (this.loggedin) {
      this.$router.push("/about");
    } else {
      this.$router.push("/");
    }
  },
};
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
