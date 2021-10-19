<template lang="pug">
img.logo.mx-auto.my-5(alt="tyland logo" src="./assets/logo.png")
fieldset
  legend 登入系統
  div
    label(for="account") 帳號
    input(type="text" id="account" name="account")
  div
    label(for="password") 密碼
    input(type="password" id="password" name="password")
  .text-center: TylandButton 登入
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
@mixin shadow-level($first, $second, $opacity) {
    -webkit-filter: drop-shadow($first $first $second rgba(0, 0, 0, $opacity));
    filter: drop-shadow($first $first $second rgba(0, 0, 0, $opacity))
}

.logo {
  width: 90%;
  @include shadow-level(6px, 7px, 0.4);
}

fieldset {
  @apply m-2 p-2 rounded-xl bg-gray-200 shadow-xl;
}

input {
  @apply w-full border-2 border-pink-400 mb-3 p-1;
}

legend {
  @apply bg-pink-200 text-black text-xl font-bold py-3 px-3 rounded-xl;
}
</style>
