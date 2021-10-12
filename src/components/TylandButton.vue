<template lang="pug">
button.btn-basic(:class="classNames"): slot
</template>
<script>
export default {
  props: {
    variant: { type: String, default: 'primary' }
  },
  computed: {
    classNames () {
      const classes = []
      this.variant === 'primary' && classes.push('btn-primary')
      this.variant === 'secondary' && classes.push('btn-secondary')
      return classes
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-basic {
  @apply mx-1 w-16 px-4 py-1 text-sm text-black font-semibold rounded-full border border-gray-400
    hover:border-transparent
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2;
    &.btn-primary {
      @apply
        hover:bg-pink-300
        focus:ring-pink-600;
    }
    &.btn-secondary {
      @apply
        hover:bg-gray-300
        focus:ring-gray-600;
    }
}
</style>