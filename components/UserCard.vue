<template lang="pug">
b-card.text-left(
  ref="user-edit-card",
  header-bg-variant="secondary",
  header-text-variant="white"
)
  template(#header): .d-flex.justify-content-between.align-items-center
    span 帳號：{{ userData.id }}
  
  b-input-group(prepend="姓名", size="sm"): b-input(
    v-model="mongoData.name",
    :state="userNameOK",
    trim
  )
  b-input-group.my-1(prepend="權限", size="sm"): b-radio-group.my-auto.ml-3(v-model="mongoData.authority", :options="editAuthOpts")
  b-input-group(prepend="備註", size="sm"): b-input(
    v-model="mongoData.note"
    trim
  )
  b-input-group.my-1(prepend="密碼", size="sm"): b-input(
    type="password"
    v-model="modifiedPwd",
    :state="modifiedPwdOK",
    trim
  )
  b-input-group(v-if="modifiedPwdOK", prepend="驗證", size="sm"): b-input(
    type="password"
    v-model="verifiedPwd",
    :state="verifiedPwdOK",
    trim
  )

  .text-center.mt-1: b-button.my-auto(:variant="editBtnOK ? 'primary' : 'outline-secondary'", size="sm", @click="edit", :disabled="!editBtnOK")
    b-icon.mr-1(icon="pencil-square")
    span 更新
  

  //- template(#footer): .d-flex.justify-content-between.align-items-center.text-muted
    //- span 上傳者：{{ markCreator }}
    //- span 地號：{{ formatedLandNumber }}
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  props: {
    userData: { type: Object, require: true },
  },
  data: () => ({
    mongoData: {
      id: "",
      name: "",
      pwd: "",
      authority: 0,
      note: ""
    },
    modifiedPwd: "",
    verifiedPwd: "",
    editAuthOpts: [
      { text: "一般", value: 0 },
      { text: "管理者", value: 1 },
      { text: "停用", value: 2 }
    ]
  }),
  computed: {
    userNameOK() { return !isEmpty(this.mongoData.name); },
    modifiedPwdOK() {
      if (isEmpty(this.modifiedPwd)) {
        return null;
      }
      return this.modifiedPwd.length > 7
    },
    verifiedPwdOK() {
      return this.modifiedPwd === this.verifiedPwd;
    },
    editBtnOK() {
      if (this.userNameOK) {
        if (this.modifiedPwdOK === null) {
          return true;
        } else {
          return this.modifiedPwdOK && this.verifiedPwdOK;
        }
      }
      return false;
    }
  },
  watch: {},
  created() {
    this.$axios
      .post("/api/user", { id: this.userData.id })
      .then(({ data }) => {
        if (data.statusCode > 0) {
          const users = data.payload;
          if (Array.isArray(users)) {
            this.mongoData = { ... users[0] };
          } else {
            console.warn(`payload 不是陣列，無法取得 ${this.userData.id} 資料。`, users);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  },
  methods: {
    edit() {}
  },
};
</script>

<style lang="scss" scoped>
</style>
