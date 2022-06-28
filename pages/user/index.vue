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
    :placeholder="`字首須以 ${site} 起始`"
    trim
  )
  b-input-group.my-1(prepend="姓名", size="sm"): b-input(
    v-model="newName",
    :state="newNameOK",
    trim
  )
  b-input-group(prepend="密碼", size="sm"): b-input(
    v-model="newPwd",
    type="password",
    :state="newPwdOK",
    placeholder="... 至少8個字元 ...",
    trim
  )
  b-input-group.my-1(prepend="備註", size="sm"): b-input(
    v-model="newNote"
    trim
  )
  b-input-group.my-1(prepend="權限", size="sm"): b-radio-group.my-auto.ml-1(v-model="newAuth", :options="newAuthOpts")
  hr
  h6 使用者列表 👉 點選人名標籤進行編輯
  .text-center(v-if="isBusy"): b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="3")
  div: b-button.m-1(
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
import debounce from "lodash/debounce";
import MD5 from "crypto-js/md5";
import UserCard from "~/components/UserCard.vue";

export default {
  head: {
    title: "使用者管理-界標閱覽系統"
  },
  components: { UserCard },
  data: () => ({
    newId: "",
    newName: "",
    newPwd: "",
    newAuth: 0,
    newNote: "",
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
    newPwdHash() { return MD5(this.newPwd).toString(); },
    newIdOK() { return !isEmpty(this.newId) && !this.userMap.has(this.newId) && this.newId?.startsWith(this.site); },
    newNameOK() { return !isEmpty(this.newName); },
    newPwdOK() { return !isEmpty(this.newPwd) && this.newPwd.length > 7; },
    addBtnOK() { return this.newIdOK && this.newPwdOK && this.newNameOK; }
  },
  created() {
    // force reload if currernt user not found in the Map
    this.prepareUserMap(true);
    this.debouncedRefreshList = debounce(this.refreshList, 2000);
  },
  mounted() {
    this.isBusy = true;
    this.debouncedRefreshList();
  },
  methods: {
    refreshList() {
      this.isBusy = true;
      this.list = [];
      this.userMap.forEach((value, key, map) => {
        if (key?.startsWith(this.site)) {
          this.list.push({ name: value, id: key });
        }
      });
      this.isBusy = false;
    },
    add() {
      this.isBusy = true;
      const insertData = {
        id: this.newId,
        name: this.newName,
        pwd: this.newPwdHash,
        authority: this.newAuth,
        note: this.newNote,
        token: { hash: MD5(+new Date()).toString(), expire: +new Date() }
      };
      this.$axios
        .post(`/api/user/${this.newId}`, insertData)
        .then(({ data }) => {
          if (data.statusCode > 0) {
            this.prepareUserMap(true);
            this.newId = "";
            this.newName = "";
            this.newAuth = 0;
            this.newNote = "";
            this.success(data.message);
            this.refreshList();
          } else {
            this.warning(data.message);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    edit(user) {
      this.modal(this.$createElement(UserCard, {
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
