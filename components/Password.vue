<template lang="pug">
.d-flex.justify-content-between.align-items-center
  b-button(
    size="sm",
    variant="outline-primary",
    @click="modify"
  ) 變更密碼
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  // emit: ["remove"],
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  created() {
  },
  methods: {
    modify() { }
  }
};
</script>

<style lang="scss" scoped>
</style>
