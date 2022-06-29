<template lang="pug">
transition(name="slide" mode="out-in" appear): .p-2(v-show="show" :class="classes"): span
  a(
    href="https://github.com/pyliu/tyland-sur-frontend"
    target="_blank"
    title="View project on Github!"
  ): b-icon(icon="github").text-dark.mr-1 
  strong.
    #[span ©]
    #[a(href="mailto:pangyu.liu@gmail.com") LIU, PANG-YU]
    2022 ALL RIGHTS RESERVED.
  //- a(href="https://vuejs.org/" target="_blank" title="Learn Vue JS!"): i.text-success
</template>

<script>
export default {
  data: () => ({
    show: false,
    classes: [
      "text-muted",
      "fixed-bottom",
      "my-2",
      "mx-3",
      "bg-white",
      "border",
      "rounded",
      "text-center",
      "p-2",
      "shadow-lg",
      "small"
    ],
  }),
  mounted() {
    setTimeout(() => (this.show = true), 1000)
    setTimeout(() => (this.show = false), 10000)
  }
};
</script>

<style lang="scss" scoped>
.slide-leave-active,
.slide-enter-active {
  transition: all .5s ease;
}
.slide-enter-from {
  transform: translateY(-100%);
}
.slide-leave-to {
  transform: translateY(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
