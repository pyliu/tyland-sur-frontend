<template lang="pug">
div(v-if="dataReady")
  b-card(
    :title="formatedCaseId",
    :sub-title="`立案者：${userMap.get(creator) || creator}`"
  )
    b-card-text
      b-input-group.my-1(prepend="　　地段"): b-select(
        v-model="caseData.section",
        :options="sectionOpts",
        :state="sectionOK",
        :disabled="!isOwner"
      )
      b-input-group(prepend="複丈日期"): b-input(
        v-model="caseData.opdate",
        type="date",
        :max="maxOpdate",
        :state="opdateOK",
        :disabled="!isOwner"
      )
      .d-flex.justify-content-center.mt-2
        b-button.mt-1(
          v-if="isOwner",
          :variant="ok ? 'primary' : 'outline-secondary'",
          :disabled="btnDisabled",
          @click="modify",
          pill
        )
          b-icon.mr-1(icon="pencil-square")
          span 修改
  hr
  b-card
    template(#header): .d-flex.justify-content-between.align-items-center
      span 地號
      b-button(variant="outline-light", v-b-modal.add-land-modal): b-icon.mr-2(
        icon="plus-circle-fill",
        variant="primary",
        font-scale="1.25"
      )
      b-modal#add-land-modal(
        ref="add-land-modal",
        :title="`新增地號 - ${section} - ${formatedCaseId}`"
      )
        b-input-group.my-1(prepend="地號"): b-input(
          id="input-live"
          v-model="landNum",
          :state="landNumOK"
          placeholder="輸入地號 ... "
          trim
        )
        b-form-text.text-right(id="input-live-help") {{ formatedLandNum }}
        template(#modal-footer="{ ok, cancel, hide }")
          b-button(
            @click="addLandNumber",
            variant="outline-primary",
            :disabled="!landNumOK"
          ) 確認

    b-card-text
      b-list-group(v-if="caseData.lands.length > 0", flush)
        b-list-group-item(
          v-for="(land, idx) in caseData.lands",
          :key="`land_${idx}`"
        ).
          AAA
      .text-center.my-3(v-else) ⚠ 無資料
.text-center.mt-5(v-else-if="isBusy")
  b-icon(icon="arrow-clockwise", animation="spin-pulse", font-scale="4")
h4.text-center.mt-5(v-else) ⚠ 找不到資料 ‼
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  head: {
    title: "案件詳情-界標閱覽系統",
  },
  data: () => ({
    caseData: {},
    sectionOpts: [],
    maxOpdate: "",
    origSection: "",
    origOpdate: "",
    landNum: "",
  }),
  computed: {
    landNumOK() {
      return !isEmpty(this.formatedLandNum);
    },
    formatedLandNum() {
      if (this.landNum.length > 9) {
        return "";
      }
      if (this.landNum.includes("-")) {
        const numbers = this.landNum.split("-");
        if (numbers[0].length > 4) {
          this.warning(`母號格是不正確 ${number[0]}`);
          return "";
        }
        if (numbers[1].length > 4) {
          this.warning(`子號格是不正確 ${number[1]}`);
          return "";
        }
        const parent = parseInt(numbers[0]);
        const child = parseInt(numbers[1]);
        if (parent > 9999 || parent < 0 || child < 0 || child > 9999) {
          console.warn("地號格式不正確", `${parent}-${child}`);
          return "";
        }
        return ("0000" + parent).slice(-4) + ("0000" + child).slice(-4);
      } else {
        const number = parseInt(this.landNum);
        if (number > 0 && number < 10000) {
          return ("0000" + number).slice(-4) + "0000";
        }
        console.warn("地號格式不正確", `${number}-0000`);
        return "";
      }
    },
    btnDisabled() {
      if (this.sectionChanged || this.opdateChanged) {
        return !this.ok || this.isBusy;
      }
      return true;
    },
    sectionChanged() {
      return this.caseData.section !== this.origSection;
    },
    opdateChanged() {
      return this.caseData.opdate !== this.origOpdate;
    },
    sectionOK() {
      return !isEmpty(this.caseData.section);
    },
    opdateOK() {
      return !isEmpty(this.caseData.opdate) && this.opdate <= this.today;
    },
    ok() {
      return this.sectionOK && this.opdateOK;
    },
    _id() {
      return this.caseData._id;
    },
    queryCaseId() {
      return this.$route.params.id;
    },
    formatedYear() {
      return ("000" + this.caseData.year).slice(-3);
    },
    formatedCode() {
      return ("XXXX" + this.caseData.code).slice(-4);
    },
    formatedNum() {
      return ("000000" + this.caseData.num).slice(-6);
    },
    caseId() {
      return `${this.formatedYear}-${this.formatedCode}-${this.formatedNum}`;
    },
    formatedCaseId() {
      return `${this.formatedYear} 年 ${this.code}(${this.formatedCode}) 字 ${this.formatedNum} 號`;
    },
    rawCaseId() {
      return this.caseId.replaceAll("-", "");
    },
    opdate() {
      return this.caseData.opdate;
    },
    sectionCode() {
      return this.caseData.section;
    },
    section() {
      return this.sections.get(this.caseData.section);
    },
    code() {
      return this.codes.get(this.caseData.code);
    },
    creator() {
      return this.caseData.creator;
    },
    dataReady() {
      return !isEmpty(this.wip) && this.$route.params.id === this.caseId;
    },
    isOwner() {
      return this.creator === this.userId;
    },
  },
  watch: {
    wip(val) {
      this.caseData = { ...val };
    },
  },
  created() {
    this.maxOpdate = this.today;
    this.sections.forEach((val, key, map) => {
      this.sectionOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
    this.caseData = { ...this.wip };
    if (!this.dataReady) {
      this.isBusy = true;
      console.warn(
        `STORE資料(${this.caseId})與查詢案件資料(${this.queryCaseId})不同，重新查詢DB ... `
      );
      const parts = this.queryCaseId.split("-");
      this.$axios
        .post("/api/search", {
          year: parts[0],
          code: parts[1],
          num: parts[2],
          limit: 1,
        })
        .then(({ data }) => {
          if (data.statusCode !== this.statusCode.SUCCESS) {
            this.warning(data.message, { subtitle: this.queryCaseId });
          } else {
            this.$store.commit("wip", data.payload[0]);
            this.notify(data.message);
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
          this.origSection = this.caseData.section;
          this.origOpdate = this.caseData.opdate;
        });
    }
    this.origSection = this.caseData.section;
    this.origOpdate = this.caseData.opdate;
  },
  methods: {
    refreshList() {
      // refresh list data
      if (this.wipList.length > 0) {
        let found = -1;
        this.wipList.find((val, idx, arr) => {
          val._id === this.caseData._id && (found = idx);
          return val._id === this.caseData._id;
        });
        if (found !== -1) {
          this.wipList[found] = this.caseData;
        }
      }
    },
    modify() {
      this.isBusy = true;
      this.$axios
        .post("/api/update", {
          _id: this.caseData._id,
          section: this.caseData.section,
          opdate: this.caseData.opdate,
        })
        .then(({ data }) => {
          if (data.statusCode === this.statusCode.SUCCESS) {
            this.$store.commit("wip", this.caseData);
            this.notify(data.message);
            // refresh orig data to new ones
            this.origSection = this.caseData.section;
            this.origOpdate = this.caseData.opdate;
            this.refreshList();
          } else {
            this.warning(data.message, { subtitle: this.queryCaseId });
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          this.isBusy = false;
        });
    },
    addLandNumber() {
      if (!Array.isArray(this.caseData.lands)) {
        this.caseData.lands = [];
      }
      const existed = this.caseData.lands.find((element) => {
        return element.number === this.landNum;
      });
      if (existed) {
        this.warning(`⚠ 地號 ${this.landNum} 已存在。`);
      } else {
      }
      this.landNum = "";
      this.$refs["add-land-modal"].hide();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
