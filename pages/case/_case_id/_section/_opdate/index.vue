<template lang="pug">
div(v-if="dataReady")
  
  .d-flex.justify-content-between.align-items-center
    span(v-if="!modification") {{ formatedCaseId }}
    span(v-if="!modification") {{ section }}
    span(v-if="!modification") {{ opdate }}
    span
    b-button.p-1.border-0(
      v-b-tooltip="'切換顯示/修改介面'",
      size="sm",
      variant="outline-secondary",
      @click="toggleModification"
    )
      b-icon.mr-1(:icon="collapseIcon")
      span {{ modification ? "收起" : "修改" }}
  b-collapse(v-model="modification"): b-card
    b-card-title {{ formatedCaseId }}
    b-card-sub-title.d-flex.justify-content-between.align-items-center
      span {{ `立案者：${userMap.get(creator) || creator}` }}
      b-button.mt-1(
        v-if="isOwner",
        size="sm",
        :variant="modifyBtnDisabled ? 'outline-secondary' : 'primary'",
        :disabled="modifyBtnDisabled",
        @click="modify",
        pill
      )
        b-icon.mr-1(icon="pencil-square")
        span 修改
    b-card-text
      b-input-group.my-1(prepend="　　地段"): b-select(
        v-model="caseData.section",
        :options="sectionOpts",
        :state="sectionOK",
        :readonly="!isOwner"
      )
      b-input-group(prepend="複丈日期"): b-input(
        v-model="caseData.opdate",
        type="date",
        :max="maxOpdate",
        :state="opdateOK",
        :readonly="!isOwner"
      )
  
  hr
  
  .d-flex.justify-content-start.align-items-center
    b-button.p-1.mt-n1(variant="outline-light", v-b-modal.add-land-modal): b-icon(
      icon="plus-circle-fill",
      variant="primary",
      font-scale="1.25"
    )
    h5 地號
    b-modal#add-land-modal(
      ref="add-land-modal",
      :title="`新增地號 - ${section} - ${formatedCaseId}`"
      centered
    )
      div 地號
      .d-flex.align-items-center
        b-input(
          type="number",
          min="0",
          max="9999",
          v-model="landParent",
          :state="landParentOK",
          placeholder="母號",
          trim
        )
        .mx-1 -
        b-input(
          type="number",
          min="0",
          max="9999",
          v-model="landChild",
          :state="landChildOK",
          placeholder="子號",
          trim
        )
      b-form-text.text-right.text-muted {{ formatedLandNum }}
      template(#modal-footer="{ ok, cancel, hide }")
        b-button(
          @click="addLandNumber",
          :variant="landBtnDisabled ? 'outline-secondary' : 'primary'"
          :disabled="landBtnDisabled"
        ) 確認

  b-list-group(v-if="caseData.lands.length > 0", flush)
    b-list-group-item(
      v-for="(land, idx) in caseData.lands",
      :key="`land_${idx}`"
    )
      LandItem(
        :raw="caseData"
        :land-number="land.number"
        :land-creator="land.creator"
        @remove="removeLandNumber"
      )
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
    modification: false,
    numberRegex: /^[\d]{1,4}$/i,
    sectionOpts: [],
    maxOpdate: "",
    origSection: "",
    origOpdate: "",
    landParent: "",
    landChild: "",
  }),
  computed: {
    collapseIcon() {
      return this.modification ? "caret-up" : "caret-down";
    },
    landParentOK() {
      return this.numberRegex.test(this.landParent);
    },
    landChildOK() {
      if (isEmpty(this.landChild)) {
        return null;
      }
      return this.numberRegex.test(this.landChild);
    },
    formatedLandNum() {
      const parent = ("0000" + this.landParent).slice(-4);
      const child = ("0000" + this.landChild).slice(-4);
      return `${parent}${child}`;
    },
    landBtnDisabled() {
      return this.landParentOK === false || this.landChildOK === false || this.isBusy;
    },
    modifyBtnDisabled() {
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
    paramSection() {
      return this.$route.params.section;
    },
    paramOpdate() {
      return this.$route.params.opdate;
    },
    caseData() {
      return this.wip;
    },
    _id() {
      return this.caseData._id;
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
      return !isEmpty(this.wip) && this.paramCaseId === this.caseId && this.paramOpdate === this.opdate && this.paramSection === this.sectionCode;
    },
    isOwner() {
      return this.creator === this.userId;
    }
  },
  created() {
    this.maxOpdate = this.today;
    this.sections.forEach((val, key, map) => {
      this.sectionOpts.push({
        text: `${key} ${val}`,
        value: key,
      });
    });
    if (this.dataReady) {
      this.origSection = this.caseData.section;
      this.origOpdate = this.caseData.opdate;
    } else {
      this.isBusy = true;
      console.warn(
        `STORE資料(${this.caseId})與查詢案件資料(${this.paramCaseId})不同，重新查詢DB ... `
      );
      /**
       * this.$route：
       *   fullPath: "/110-HA46-000201/0001/2021-11-24"
       *   name: "case_id-section-opdate"
       *   params:
       *     case_id: "110-HA46-000201"
       *     opdate: "2021-11-24"
       *     section: "0001"
       */
      this.$axios
        .post("/api/search", {
          year: this.paramCaseYear,
          code: this.paramCaseCode,
          num: this.paramCaseNum,
          opdate: this.paramOpdate,
          section: this.paramSection,
          limit: 1,
        })
        .then(({ data }) => {
          if (data.statusCode !== this.statusCode.SUCCESS) {
            this.warning(data.message, { subtitle: this.paramCaseId });
          } else {
            this.$store.commit("wip", data.payload[0]);
            this.notify(data.message, {
              title: "查詢案件",
              subtitle: this.paramCaseId
            });
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
  },
  methods: {
    toggleModification(event) {
      event.stopPropagation();
      event.preventDefault();
      this.modification = !this.modification;
    },
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
      // prepare set data
      const setData = {
        section: this.caseData.section,
        opdate: this.caseData.opdate
      };
      // recursive update marks data in the lands
      this.caseData.lands.forEach((land, idx, arr) => {
        arr[idx].marks.forEach((mark, idx2, arr2) => {
          setData[`lands.${idx}.marks.${idx2}.section`] = this.caseData.section;
          setData[`lands.${idx}.marks.${idx2}.opdate`] = this.caseData.opdate;
        });
      });

      this.$axios
        .post("/api/update", {
          _id: this.caseData._id,
          caseData: {
            year: this.formatedYear,
            code: this.formatedCode,
            num: this.formatedNum,
            origSection: this.origSection,
            origOpdate: this.origOpdate
          },
          setData: setData
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
    updateLandData() {
      this.$axios
        .post("/api/update", {
          _id: this.caseData._id,
          caseData: {
            year: this.formatedYear,
            code: this.formatedCode,
            num: this.formatedNum
          },
          setData: {
            lands: this.caseData.lands
          }
        })
        .then(({ data }) => {
          if (data.statusCode === this.statusCode.SUCCESS) {
            this.$store.commit("wip", this.caseData);
            this.notify(data.message);
            // this.refreshList();
          } else {
            this.warning(data.message, { subtitle: this.queryCaseId });
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
        });
    },
    addLandNumber() {
      try {
        this.isBusy = true;
        if (!Array.isArray(this.caseData.lands)) {
          this.caseData.lands = [];
        }
        const existed = this.caseData.lands.find((element) => {
          return element.number === this.formatedLandNum;
        });
        if (existed) {
          this.warning(`⚠ 地號 ${this.formatedLandNum} 已存在。`);
        } else {
          this.caseData.lands.push({
            number: this.formatedLandNum,
            creator: this.userId,
            marks: []
          });
          this.updateLandData();
        }
        this.landChild = "";
        this.landParent = "";
        this.$refs["add-land-modal"].hide();
      } catch (e) {
        console.error(e);
      } finally {
        this.isBusy = false
      }
    },
    removeLandNumber(number) {
      this.confirm(`這一個動作將刪除 ${number} 地號下所有界標資料，請確認執行？`).then((YN) => {
        if(YN) {
          try {
            this.isBusy = true;
            let foundIdx = -1;
            const existed = this.caseData.lands?.find((element, idx) => {
              if (element.number === number) {
                foundIdx = idx;
                return true;
              }
              return false;
            });
            if (foundIdx !== -1) {
              if (Array.isArray(this.caseData.lands[foundIdx].marks) && this.caseData.lands[foundIdx].marks.length > 0) {
                this.alert(`⚠ 無法刪除本地號資料(尚有 ${this.caseData.lands[foundIdx].marks.length} 筆界標資料)。`);
              } else {
                this.caseData.lands.splice(foundIdx, 1);
                this.updateLandData();
              }
            } else {
              this.warning(`⚠ 找不到 ${number} 地號。`);
            }
          } catch (e) {
            console.error(e);
          } finally {
            this.isBusy = false
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>