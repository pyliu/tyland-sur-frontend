<template lang="pug">
.h1 AA
</template>

<script>
export default {
  middleware: ['login'],
  mounted () {
    this.notify('test')
  }
}
</script>

<style lang="scss" scoped>

</style>
