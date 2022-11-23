<template lang="pug">
b-card.border-0(no-body)
  h4 收件字
  .d-flex.align-items-center
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

  h4 段小段
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
</template>

<script>
import Code from "~/components/Code.vue"
import Section from "~/components/Section.vue"

export default {
  head: {
    title: "代碼管理-界標即可拍系統"
  },
  components: { Code, Section },
  data: () => ({
  }),
  computed: {
    codeOpts() {
      const codeOpts = [];
      this.codes.forEach((val, key, map) => {
        codeOpts.push({
          text: `${key} ${val}`,
          value: key,
        });
      });
      return codeOpts;
    },
    sectionOpts() {
      const sectionOpts = [];
      this.sections.forEach((val, key, map) => {
        sectionOpts.push({
          text: `${key} ${val}`,
          value: key,
        });
      });
      return sectionOpts;
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    addCode() {
      this.modal(this.$createElement(Code, {
        props: { mode: 'add' },
        on: { close: () => this.$refs.code?.hide() }
      }), {
        ref: 'code',
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
        on: { close: () => this.$refs.code?.hide() }
      }), {
        ref: 'code',
        title: '修改收件字',
        size: 'sm',
        centered: true,
        hideFooter: true
      });
    },
    addSection() {
      this.modal(this.$createElement(Section, {
        props: { mode: 'add' },
        on: { close: () => this.$refs.section?.hide() }
      }), {
        ref: 'section',
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
        on: { close: () => this.$refs.section?.hide() }
      }), {
        ref: 'section',
        title: '修改段小段',
        size: 'sm',
        centered: true,
        hideFooter: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
