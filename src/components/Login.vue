<template lang="pug">
el-row
  el-button(@click="login") 預設
  el-button(type="primary") 主要
  el-button(type="success") 成功
  el-button(type="info") 資訊
  el-button(type="warning") 警告
  el-button(type="danger") 危險
  router-link(to="/about") ABOUT
</template>

<script>
import { ref } from 'vue'
export default {
  setup () {
    const username = ref('AAA')
    const password = ref('BBB')

    return {
      username,
      password
    }
  },
  created () {
    console.log('created', this.username, this.password)
  },
  methods: {
    login () {
      console.log(this.username, this.password)
      this.username = 'CCC'
      this.$nextTick(function () {
        console.log(this.username, this.password)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  color: #42b983;
}
</style>
