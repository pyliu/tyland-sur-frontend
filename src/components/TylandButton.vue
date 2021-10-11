<template lang="pug">
button(:class="classNames"): slot
</template>
<script>
export default {
  props: {
    variant: { type: String, default: 'primary' }
  },
  computed: {
    classNames () {
      const classes = ['btn-primary']
      this.variant === 'primary' && classes.push('btn-primary')
      return classes
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-primary {
  @apply w-16 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-pink-200
    hover:text-black
    hover:bg-pink-300
    hover:border-transparent
    focus:outline-none focus:ring-2
    focus:ring-pink-600
    focus:ring-offset-2;
}
</style>