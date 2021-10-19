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
      const classes = ['btn-primary']
      this.variant === 'secondary' && classes.splice(0, 1) && classes.push('btn-secondary')
      this.variant === 'warning' && classes.splice(0, 1) && classes.push('btn-warning')
      this.variant === 'danger' && classes.splice(0, 1) && classes.push('btn-danger')
      this.variant === 'success' && classes.splice(0, 1) && classes.push('btn-success')
      this.variant === 'info' && classes.splice(0, 1) && classes.push('btn-info')
      this.variant === 'dark' && classes.splice(0, 1) && classes.push('btn-dark')
      this.variant === 'light' && classes.splice(0, 1) && classes.push('btn-light')
      return classes
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-basic {
  @apply mx-1 w-auto px-4 py-1 text-xl text-black font-semibold rounded-full border border-gray-400
    hover:border-transparent
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2;
    &.btn-primary {
      @apply
        bg-pink-200
        hover:bg-pink-400
        focus:ring-pink-600;
    }
    &.btn-secondary {
      @apply
      bg-gray-200
      hover:bg-gray-400
      focus:ring-gray-600;
    }
}
</style>