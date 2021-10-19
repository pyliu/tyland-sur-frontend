<template lang="pug">
img.logo.mx-auto.my-5(alt="tyland logo" src="./assets/logo.png")
fieldset.m-2.p-2.rounded.bg-gray-100.shadow-xl
  legend 登入系統
  label(for="account") 帳號
  input.w-full.mx-2(type="text" id="account" name="account")
  br
  label(for="password") 密碼
  input.w-full.mx-2(type="password" id="password" name="password")
  br
  TylandButton 登入
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

legend {
  background-color: rgb(68, 66, 66);
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 10px;
}

.logo {
  width: 90%;
  @include shadow-level(6px, 7px, 0.4);
}
</style>
