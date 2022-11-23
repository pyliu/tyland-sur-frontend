<template lang="pug">
div(role="group")
  label(for="input-live") 段小段代碼:
  b-input#input-live(
    v-model="codeId",
    :state="isIdOK",
    :readonly="isModifyMode",
    :placeholder="`... 段小段代碼 ...`",
    aria-describedby="input-live-feedback",
    trim
  )
  b-form-invalid-feedback#input-live-feedback 請輸入4碼字元

  label(for="input-live-2") 段小段名稱:
  b-input#input-live-2(
    v-model="codeName",
    :state="isNameOK",
    aria-describedby="input-live-feedback-2",
    placeholder="... 段小段名稱 ...",
    trim
  )
  b-form-invalid-feedback#input-live-feedback-2 請輸入段小段名稱

  .text-center.mt-2
    b-button(
      v-if="isIdOK && isNameOK",
      variant="outline-primary",
      size="sm",
      @click="update"
    )
      span(v-if="isModifyMode") 修改
      span(v-else) 新增
    b-button.ml-1(
      v-if="isModifyMode",
      variant="outline-danger",
      size="sm",
      @click="remove"
    ) 刪除
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  emit: ['close'],
  props: {
    mode: { type: String, default: 'add' },
    inId: { type: String, default: '' },
    inName: { type: String, default: '' }
  },
  data: () => ({
    codeId: '',
    codeName: '',
  }),
  computed: {
    isModifyMode() {
      return this.mode !== 'add'
    },
    idExisted() {
      return Boolean(this.sections.get(this.codeId));
    },
    isIdOK() {
      if (
        isEmpty(this.codeId) ||
        this.idExisted ||
        this.codeId.length !== 4 ||
        parseInt(this.codeId) > 9999 ||
        parseInt(this.codeId) < 1
      ) {
        return false;
      }
      return true;
    },
    isNameOK() {
      if (isEmpty(this.codeName)) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.codeId = this.inId;
    this.codeName = this.inName;
  },
  methods: {
    update() {
      if (this.mode === 'add') {
        this.add();
      } else {
        this.modify();
      }
    },
    remove() {
      this.confirm(`請確認是否要刪除段小段?<p>${this.codeId} ❌</p>`).then((YN) => {
        if (YN) {
          this.$axios
            .delete(`/api/sections/${this.site}/${this.codeId}`)
            .then(({ data }) => {
              if (data.statusCode > 0) {
                this.success(data.message);
              } else {
                this.warning(data.message);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.$emit('close')
            });
        }
      });
    },
    modify() {
      this.confirm(`請確認是否要修改段小段名稱?<p>${this.codeId} 👉 ${this.codeName}</p>`).then((YN) => {
        if (YN) {
          this.$axios
            .put(`/api/sections/${this.site}/${this.codeId}/${this.codeName}`)
            .then(({ data }) => {
              if (data.statusCode > 0) {
                this.success(data.message);
              } else {
                this.warning(data.message);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.$emit('close')
            });
        }
      });
    },
    add() {
      this.confirm(`請確認是否要新增段小段?<p>${this.codeId} ${this.codeName} ✔</p>`).then((YN) => {
        if (YN) {
          this.$axios
            .post(`/api/sections/${this.site}/${this.codeId}/${this.codeName}`)
            .then(({ data }) => {
              if (data.statusCode > 0) {
                this.success(data.message);
                this.sections.set(this.codeId, this.codeName);
              } else {
                this.warning(data.message);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.$emit('close')
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
