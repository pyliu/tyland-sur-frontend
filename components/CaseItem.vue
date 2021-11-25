<template lang="pug">
.text-left
  .d-flex.align-items-center.justify-content-between(
    v-if="!card"
    :title="formatedCaseId"
  )
    a.link(v-if="!detail" v-b-tooltip="formatedCaseId" @click="saveWip") {{ caseId }}
    span(v-if="!detail" v-b-tooltip="sectionCode") {{ section }}
    span(v-if="!detail" v-b-tooltip="'複丈日期'") {{ opdate }}
    span(v-if="!detail" v-b-tooltip="'立案人'") {{ creator }}
    span(v-if="detail")
    b-button.p-0.border-0(
      title="顯示詳情",
      size="sm",
      variant="outline-secondary",
      @click="toggleDetail"
    ): b-icon(
      :icon="collapseIcon"
    )

  b-collapse.mt-1(v-model="detail")
    b-card.text-left
      template(#header): .d-flex.justify-content-between.align-items-center
        span(v-b-popover.focus.hover.top="sectionCode") {{ section }}
        span(v-b-popover.focus.hover.top="'複丈日期'") {{ opdate }}

      .d-flex.justify-content-start.align-items-center
        h6 地號
        b-button.p-1.mt-n2(variant="outline-light", v-b-modal="modalUUID"): b-icon(
          size="sm",
          icon="plus-circle-fill",
          variant="primary",
          font-scale="1.25"
        )
      
      b-list-group(v-if="raw.lands.length > 0", flush)
        b-list-group-item(
          v-for="(land, idx) in raw.lands",
          :key="`land_${idx}`"
        )
          LandItem(
            :raw="raw"
            :land-number="land.number"
            :land-creator="land.creator"
            @remove="removeLandNumber"
          )
      .text-center.my-3(v-else) ⚠ 無資料

      template(#footer): .d-flex.justify-content-between.align-items-center.text-muted
        strong(v-b-popover.focus.hover.top="caseId") {{ formatedCaseId }}
        strong(v-b-popover.focus.hover.top="'立案人'") {{ creator }}

  b-modal(
    :id="modalUUID"
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
</template>

<script>
import isEmpty from "lodash/isEmpty";
import CaseBase from "~/components/CaseBase.js"

export default {
  props: {
    card: { type: Boolean, default: false }
  },
  mixins: [CaseBase],
  data: () => ({
    detail: false,
    slide: 0,
    numberRegex: /^[\d]{1,4}$/i,
    landParent: "",
    landChild: "",
    modalUUID: ""
  }),
  computed: {
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
    collapseIcon() {
      return this.detail ? "caret-down" : "caret-right";
    },
  },
  created() {
    this.detail = this.card;
    this.modalUUID = this.uuid();
  },
  methods: {
    saveWip() {
      this.$store.commit("wip", this.raw);
      this.$router.push(`/list/${this.caseId}`);
    },
    toggleDetail(event) {
      event.stopPropagation();
      event.preventDefault();
      this.detail = !this.detail;
    },
    updateLandData() {
      this.$axios
        .post("/api/update", {
          _id: this.raw._id,
          setData: {
            lands: this.raw.lands
          }
        })
        .then(({ data }) => {
          if (data.statusCode === this.statusCode.SUCCESS) {
            this.$store.commit("wip", this.raw);
            console.log(this.caseId, data.message);
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
        if (!Array.isArray(this.raw.lands)) {
          this.raw.lands = [];
        }
        const existed = this.raw.lands.find((element) => {
          return element.number === this.formatedLandNum;
        });
        if (existed) {
          this.warning(`⚠ 地號 ${this.formatedLandNum} 已存在。`);
        } else {
          this.raw.lands.push({
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
      this.confirm('這一個動作將刪除本地號下所有界標資料，請確認執行？').then((YN) => {
        if(YN) {
          try {
            this.isBusy = true;
            let foundIdx = -1;
            const existed = this.raw.lands?.find((element, idx) => {
              if (element.number === number) {
                foundIdx = idx;
                return true;
              }
              return false;
            });
            if (foundIdx !== -1) {
              if (Array.isArray(this.raw.lands[foundIdx].marks) && this.raw.lands[foundIdx].marks.length > 0) {
                this.alert(`⚠ 無法刪除本地號資料(尚有 ${this.raw.lands[foundIdx].marks.length} 筆界標資料)。`);
              } else {
                this.raw.lands.splice(foundIdx, 1);
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
