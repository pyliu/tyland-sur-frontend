<template lang="pug">
div
  b-input-group.mr-1(prepend="　上傳者"): b-select(
    v-model="uploader",
    :options="uploaderOpts"
  )
  b-input-group.mr-1.my-1(prepend="複丈日期"): b-input(
    type="date",
    v-model="opdate",
    :max="maxOpdate"
  )
  b-button(variant="outline-primary", @click="search", block) 🔎 搜尋
  hr
  h5 搜尋結果
  MarkList(:list="searchedData", :loading="isBusy", :per-page="5")
</template>

<script>
import sortBy from 'lodash/sortBy';
export default {
  emit: ["data-update"],
  head: {
    title: "查詢界標 BY 上傳使用者-測量即可拍系統",
  },
  data: () => ({
    opdate: "",
    maxOpdate: "",
    uploader: "",
    uploaderOpts: [],
    searchedData: []
  }),
  computed: {
    filter() {
      return {
        "opdate": this.opdate,
        "uploader": this.uploader
      }
    }
  },
  created() {
    // force reload if currernt user not found in the Map
    this.prepareUserMap(!this.userMap.has(this.userId));
    this.uploader = this.userId;
    this.userMap.forEach((value, key, map) => {
      if (key?.startsWith(this.site)) {
        this.uploaderOpts.push({ text: `${key} / ${value}`, value: key });
      }
    });
    this.uploaderOpts = [...sortBy(this.uploaderOpts, ['value'])]
    // add default search criteria for own site users
    this.uploaderOpts.unshift({ text: "", value: `^${this.site}` });
    // this.$emit('data-update', { message: '接收使用者查詢回傳DATA' })
    this.maxOpdate = this.today;
  },
  methods: {
    search() {
      console.log("搜尋條件", this.filter);
      this.isBusy = true;
      this.searchedData = [];
      this.$axios
        .post("/api/search/creator", this.filter)
        .then(({ data }) => {
          if (Array.isArray(data.payload)) {
            this.success(data.message);
            this.searchedData = [...data.payload];
            // this.$store.commit('wipList', this.searchedData);
          } else {
            this.warning(data.message);
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
