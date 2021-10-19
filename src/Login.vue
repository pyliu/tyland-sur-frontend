<template lang="pug">
img.logo.mx-auto.my-5(alt="tyland logo" src="./assets/logo.png")

</template>

<script>
import axios from 'axios'
import { TransitionRoot } from '@headlessui/vue'
import TylandButton from './components/TylandButton.vue'

export default {
  name: 'Login',
  head: { title: '帳號登入驗證-桃園地政事務所' },
  components: { TransitionRoot, TylandButton },
  data: () => ({
    userid: '',
    password: ''
  }),
  methods: {
    login () {
      // sending file to the backend
      axios.post("http://localhost:4500/login", {
        id: this.userid,
        password: this.password
      }).then(({ data }) => {
        console.log(data)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@mixin shadow-level($first, $second, $opacity) {
    -webkit-filter: drop-shadow($first $first $second rgba(0, 0, 0, $opacity));
    filter: drop-shadow($first $first $second rgba(0, 0, 0, $opacity))
}

.logo {
  width: 90%;
  @include shadow-level(6px, 7px, 0.4)
}
</style>
