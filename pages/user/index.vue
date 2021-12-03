<template lang="pug">
b-card
  .d-flex.justify-content-between.align-items-center
    h6 新建使用者
    b-button.my-auto(:variant="addBtnOK ? 'primary' : 'outline-secondary'", size="sm", @click="add", :disabled="!addBtnOK")
      b-icon.mr-1(icon="plus-circle")
      span 新增
  b-input-group.my-1(prepend="帳號", size="sm"): b-input(
    v-model="newId",
    :state="newIdOK",
    trim
  )
  b-input-group(prepend="密碼", size="sm"): b-input(
    v-model="newPwd",
    type="password",
    :state="newPwdOK",
    placeholder="... 至少8個字元 ...",
    trim
  )
  b-input-group.my-1(prepend="權限", size="sm"): b-radio-group.my-auto.ml-3(v-model="newAuth", :options="newAuthOpts")
  hr
  h6 系統內使用者
  b-button.m-1(
    v-for="user in list",
    :key="`${user.id}`",
    :title="`編輯 ${user.id} / ${user.name}`",
    size="sm",
    variant="outline-primary",
    pill,
    @click="edit(user)"
  ) {{ user.name }}
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  head: {
    title: "使用者管理-界標閱覽系統"
  },
  data: () => ({
    newId: "",
    newPwd: "",
    newAuth: 0,
    newAuthOpts: [
      { text: "一般", value: 0 },
      { text: "管理者", value: 1 }
    ],
    auth: {
      normal: 0,
      admin: 1,
      disabled: 2
    },
    list: [],
  }),
  computed: {
    newIdOK() { return !isEmpty(this.newId) && !this.userMap.has(this.newId); },
    newPwdOK() { return !isEmpty(this.newPwd) && this.newPwd.length > 7; },
    addBtnOK() { return this.newIdOK && this.newPwdOK; }
  },
  created() {
    // force reload if currernt user not found in the Map
    this.prepareUserMap(!this.userMap.has(this.userId));
    this.userMap.forEach((value, key, map) => {
      this.list.push({ name: value, id: key });
    });
  },
  methods: {
    add() {},
    edit(user) {
      this.modal(this.$createElement("UserCard", {
        props: { userData: user }
      }), {
        title: `編輯 ${user.id} / ${user.name}`
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
