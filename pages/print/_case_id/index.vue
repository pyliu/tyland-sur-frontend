<template lang="pug">
b-card.border-0(no-body)
  section(v-if="isValid")
    .d-flex.justify-content-between
      b-card-title {{ formatedCaseId }}
      b-card-title 段小段：{{ sectionCode }} {{ section }}
      b-card-title 複丈日期：{{ opDate }}
      //- .text-muted.small {{ paramCaseId }}
    b-card-body(v-for="(land, idx) in lands", :key="`${land.number}_${idx}`")
      .d-flex.justify-content-between
        .h5 地號：{{ formatLandNumber(land.number) }}
        .h5 建立人：{{ land.creator }} {{ getUserName(land.creator) }}
      hr
      b-card.my-3(
        v-for="(mark, midx) in land.marks" :key="`${land.number}_${idx}_${midx}`",

      )
        template(#header)
          h6.mb-0 \#{{ mark.serial }} {{ mark.type }}
        b-row.my-2
          b-col.text-center
            b-img.shadow(:src="`${getBaseImgSrc(land, mark)}/near`", thumbnail, fluid, @load="loaded++")
          b-col.text-center
            b-img.shadow(:src="`${getBaseImgSrc(land, mark)}/far`", thumbnail, fluid, @load="loaded++")
  .my-5.text-center.h1(v-else) ⚠ 請回上一頁重新選擇案件
  //- CaseList.mt-2(:list="list", :loading="isBusy")
</template>

<script>
export default {
  head: {
    title: "案件列印-界標即可拍系統"
  },
  layout: 'print',
  data: () => ({
    caseData: {},
    loaded: 0
  }),
  computed: {
    isValid () {
      if (!this.isEmpty(this.caseData)) {
        return this.caseData?.year && this.caseData?.code && this.caseData?.num;
      }
      return false;
    },
    caseId() {
      if (!this.isValid) {
        this.alert('案件資料有問題，請檢查主控台視窗!');
        console.warn(this.caseData);
        return false;
      }
      return ("000" + this.caseData.year).slice(-3) + '-'
        + ("XXXX" + this.caseData.code).slice(-4) + '-'
        + ("000000" + this.caseData.num).slice(-6);
    },
    formatedCaseId() {
      if (this.isValid) {
        return `${("000" + this.caseData.year).slice(-3)} 年 ${this.codes.get(this.caseData.code)}(${this.caseData.code}) 字 ${("000000" + this.caseData.num).slice(-6)} 號`;
      }
      return false;
    },
    sectionCode () {
      return this.caseData.section;
    },
    section () {
      return this.sections.get(this.sectionCode);
    },
    opDate () {
      return this.caseData.opdate;
    },
    lands () {
      return this.caseData?.lands || []
    },
    paramCaseId() {
      return this.$route.params.case_id;
    },
    paramCaseYear() {
      return this.paramCaseId.substring(0, 3);
    },
    paramCaseCode() {
      return this.paramCaseId.substring(4, 8);
    },
    paramCaseNum() {
      return this.paramCaseId.substring(9);
    },
    markCount () {
      let count = 0;
      if (this.lands.length > 0) {
        this.caseData.lands.forEach(land => {
          if (Array.isArray(land.marks)) {
            count += land.marks.length * 2
          }
        });
      }
      return count;
    }
  },
  watch: {
    caseData (val) {},
    loaded (val) {
      // all images loaded, bring print dialog up
      if (val === this.markCount) {
        window.print();
      }
    }
  },
  created() {
    this.caseData = {...this.wip};
  },
  mounted () {},
  methods: {
    getUserName (id) {
      return this.userMap.get(id)
    },
    formatLandNumber (str) {
      if (typeof str === 'string' && str.length === 8) {
        const mainNumber = str.substring(0, 4).replace(/^0+/, '');
        const subNumber = str.substring(4).replace(/^0+/, '');
        return this.isEmpty(subNumber) ? mainNumber : `${mainNumber}-${subNumber}`;
      }
      return str
    },
    getBaseImgSrc (land, mark) {
      return `/mark/${this.paramCaseId}/${this.sectionCode}/${this.opDate}/${land.number}/${mark.serial}`
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
