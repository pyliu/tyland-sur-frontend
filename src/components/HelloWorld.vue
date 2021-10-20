<template lang="pug">
el-row
  el-button 預設
  el-button(type="primary") 主要
  el-button(type="success") 成功
  el-button(type="info") 資訊
  el-button(type="warning") 警告
  el-button(type="danger") 危險
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<style lang="scss" scoped>
a {
  color: #42b983;
}
</style>
