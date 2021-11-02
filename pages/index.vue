<template lang="pug">
.h1 THIS IS INDEX PAGE
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
