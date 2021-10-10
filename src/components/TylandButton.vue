<template lang="pug">
button.btn-tyland
  slot
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.btn-tyland {
  @apply px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-pink-200 hover:text-black hover:bg-pink-300 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2;
}
</style>