<template lang="pug">
b-card.border-0(no-body)
  h4 管理收件字
  .d-flex.flex-wrap.align-items-center
    b-button.my-1(
      variant="primary",
      @click="addCode"
    ) 新增
    b-button.mx-1.my-1(
      v-for="(code, idx) in codeOpts",
      :key="`code_${idx}`",
      variant="outline-secondary",
      @click="modifyCode(code)"
    ) {{ code.text }}

  hr

  h4 管理段小段
  .d-flex.flex-wrap.align-items-center.text-nowrap
    b-button.my-1(
      variant="primary",
      @click="addSection"
    ) 新增
    b-button.mx-1.my-1(
      v-for="(sect, idx) in sectionOpts",
      :key="`sect_${idx}`",
      variant="outline-secondary",
      @click="modifySection(sect)"
    ) {{ sect.text }}
  
  hr
</template>

<script>
import Code from "~/components/Code.vue";
import Section from "~/components/Section.vue";

export default {
  head: {
    title: "代碼管理-測量即可拍系統"
  },
  components: { Code, Section },
  data: () => ({
    codeOpts: [],
    sectionOpts: []
  }),
  computed: { },
  created() {
    this.refreshOpts();
  },
  mounted() {
  },
  methods: {
    addCode() {
      this.modal(this.$createElement(Code, {
        props: { mode: 'add' },
        on: {
          close: () => {
            this.hideModal('add-code-modal');
            this.refreshOpts();
          }
        }
      }), {
        id: 'add-code-modal',
        title: '新增收件字',
        size: 'sm',
        centered: true,
        hideFooter: true
      });
    },
    modifyCode(code) {
      this.modal(this.$createElement(Code, {
        props: {
          mode: 'modify',
          inId: code.value,
          inName: code.text.split(' ')[1]
        },
        on: {
          close: () => {
            this.hideModal('modify-code-modal');
            this.refreshOpts();
          }
        }
      }), {
        id: 'modify-code-modal',
        title: '修改收件字',
        size: 'sm',
        centered: true,
        hideFooter: true
      });
    },
    addSection() {
      this.modal(this.$createElement(Section, {
        props: { mode: 'add' },
        on: {
          close: () => {
            this.hideModal('add-section-modal');
            this.refreshOpts();
          }
        }
      }), {
        id: 'add-section-modal',
        title: '新增段小段',
        size: 'sm',
        centered: true,
        hideFooter: true
      });
    },
    modifySection(sect) {
      this.modal(this.$createElement(Section, {
        props: {
          mode: 'modify',
          inId: sect.value,
          inName: sect.text.split(' ')[1]
        },
        on: {
          close: () => {
            this.hideModal('modify-section-modal');
            this.refreshOpts();
          }
        }
      }), {
        id: 'modify-section-modal',
        title: '修改段小段',
        size: 'sm',
        centered: true,
        hideFooter: true
      });
    },
    refreshOpts() {
      this.codeOpts = [];
      this.codes.forEach((val, key, map) => {
        this.codeOpts.push({
          text: `${key} ${val}`,
          value: key,
        });
      });
      this.sectionOpts = [];
      this.sections.forEach((val, key, map) => {
        this.sectionOpts.push({
          text: `${key} ${val}`,
          value: key,
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
