<template lang="pug">
b-card
  .d-flex.justify-content-between.align-items-center
    h5.my-auto #[b-icon(icon="people-fill")] 帳號管理
    b-checkbox.my-auto(v-model="addUI", switch) 建立新帳號
    //- b-button(
    //-   pill,
    //-   size="sm",
    //-   :variant="collapsedIconVariant",
    //-   @click="addUI = !addUI"
    //- ): b-icon(:icon="collapsedIcon", :scale="0.5")
  b-collapse(v-model="addUI")
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
    .text-center: b-button.my-auto(
      v-if="addBtnOK",
      variant="primary",
      size="sm",
      @click="add",
      pill
    ) 確定新增
  hr
  h6: .d-flex.align-items-center
    .mr-2 顯示選項
    b-checkbox-group(v-model="selectedCheckbox", size="sm")
      b-checkbox(:value="0") 一般
      b-checkbox(:value="2") 停用
      b-checkbox(:value="1") 系管
  .text-center(v-if="isBusy"): b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="3")
  div: b-button.m-1(
    v-for="user in list",
    v-if="isVisible(user.id)"
    :key="`${user.id}`",
    :title="`編輯 ${user.id} / ${user.name}`",
    :variant="variant(user.id)",
    v-b-tooltip="tooltip(user.id)",
    size="sm",
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
    title: "使用者管理-界標即可拍系統"
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
    selectedCheckbox: [0, 1],
    addUI: false
  }),
  computed: {
    newPwdHash() { return MD5(this.newPwd).toString(); },
    newIdOK() { return !isEmpty(this.newId) && !this.userMap.has(this.newId) && this.newId?.startsWith(this.site); },
    newNameOK() { return !isEmpty(this.newName); },
    newPwdOK() { return !isEmpty(this.newPwd) && this.newPwd.length > 7; },
    addBtnOK() { return this.newIdOK && this.newPwdOK && this.newNameOK; },
    collapsed() { return !this.addUI },
    collapsedIcon() { return this.collapsed ? 'arrow-down' : 'arrow-up'; },
    collapsedIconVariant() { return this.collapsed ? 'primary' : 'secondary'; }
  },
  watch: {},
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
            this.debouncedRefreshList();
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
        props: { userData: user },
        on: {
          refresh: () => {
            this.debouncedRefreshList();
          }
        }
      }), {
        title: `編輯 ${user.id} / ${user.name}`
      })
    },
    isVisible(id) {
      return this.selectedCheckbox.includes(this.authMap.get(id));
    },
    isAdmin(id) {
      return this.authMap.get(id) & 1;
    },
    isDisabled(id) {
      return this.authMap.get(id) & 2;
    },
    variant(id) {
      if (this.isDisabled(id)) {
        return 'dark';
      }
      if (this.isAdmin(id)) {
        return 'danger';
      }
      return 'outline-primary';
    },
    tooltip(id) {
      if (this.isDisabled(id)) {
        return '已停用';
      }
      if (this.isAdmin(id)) {
        return '管理者';
      }
      return '';
    },
    toogleAddUI() {
      this.addUI = this.addUI;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
