<template lang="pug">
b-card.text-left(
  ref="user-edit-card",
  header-bg-variant="secondary",
  header-text-variant="white"
)
  template(#header): .d-flex.justify-content-between.align-items-center
    span 帳號：{{ userData.id }}
  
  b-input-group.my-1(v-if="!isDefaultAdmin", prepend="姓名", size="sm"): b-input(
    v-model="mongoData.name",
    :state="userNameOK",
    trim
  )
  b-input-group.my-1(prepend="密碼", size="sm"): b-input(
    type="password"
    v-model="modifiedPwd",
    :state="modifiedPwdOK",
    trim
  )
  b-input-group.my-1(v-if="modifiedPwdOK", prepend="驗證", size="sm"): b-input(
    type="password"
    v-model="verifiedPwd",
    :state="verifiedPwdOK",
    trim
  )
  b-input-group.my-1(v-if="!isDefaultAdmin", prepend="權限", size="sm"): b-radio-group.my-auto.mx-auto(v-model="mongoData.authority", :options="editAuthOpts")
  b-input-group.my-1(v-if="!isDefaultAdmin", prepend="備註", size="sm"): b-input(
    v-model="mongoData.note"
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
import MD5 from "crypto-js/md5";

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
    isDefaultAdmin() { return this.mongoData.id === 'HAADMIN' },
    userNameChanged() { return this.userData.name !== this.mongoData.name },
    userNameOK() { return !isEmpty(this.mongoData.name); },
    userPasswordChanged() { return this.modifiedPwdMD5Hash !== this.mongoData.pwd; },
    modifiedPwdOK() {
      if (isEmpty(this.modifiedPwd)) {
        return null;
      }
      return this.modifiedPwd.length > 7
    },
    modifiedPwdMD5Hash() {
      return MD5(this.modifiedPwd).toString();
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
  watch: {
  },
  created() {
    this.$axios
      .get(`/api/user/${this.userData.id}`)
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
    edit() {
      const updateData = {
        name: this.mongoData.name,
        note: this.mongoData.note,
        authority: this.mongoData.authority
      };
      if (this.modifiedPwdOK !== null && this.verifiedPwdOK) {
        if (this.userPasswordChanged) {
          updateData.pwd = this.modifiedPwdMD5Hash;
        } else {
          this.notify("⚠ 密碼跟之前一樣，因此不會更新!");
        }
      }
      this.$axios
        .put(`/api/user/${this.userData.id}`, updateData)
        .then(({ data }) => {
          if (data.statusCode > 0) {
            this.success(data.message);
            if (this.userNameChanged) {
              this.userData.name = this.mongoData.name;
              this.prepareUserMap(true);
            }
          } else {
            this.warning(data.message);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
