<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    b-button.border-0.p-0.mr-1(
      v-if="isOwner && markCount === 0",
      size="sm",
      variant="outline-danger",
      :title="`刪除地號 ${formatedLandNumber}`",
      @click="removeLandNumber"
    ) ❌

    b-button.p-0.border-0.mr-1(size="sm", :variant="collapseVariant", @click="toggleDetail")
      b-icon(:icon="collapseIcon")
    a(href="#", v-b-tooltip="`建立人：${userMap.get(landCreator) || landCreator}`", @click="toggleDetail") {{ formatedLandNumber }}
    b-badge.mx-1(v-if="markCount > 0", variant="primary", pill, title="界標數") {{ markCount }}
    b-button.p-1.border-0.ml-auto(
      size="sm",
      variant="outline-success",
      :title="`在地號 ${formatedLandNumber} 裡新增界標`",
      @click="$refs['add-mark-modal'].show()"
    )
      b-icon(
        size="sm",
        icon="plus-circle-fill",
        font-scale="1.3"
      )
      span.ml-1 界標
    b-checkbox.ml-1.mt-1(v-model="collapseAll", size="sm", switch, v-b-tooltip="'展開全部界標'") 展開

  b-modal(
    ref="add-mark-modal",
    :title="`新增 ${addMarkType} 界標 - ${formatedLandNumber}`",
    size="sm",
    centered
  )
    b-form-group(label="編號"): b-input(
      v-model="addMarkSerial"
      type="number"
      min="1"
      :state="addMarkSerialOK"
    )
    b-form-group.my-1(label="種類")
      b-radio-group(v-model="addMarkType", :options="addMarkOpts", stacked)
      b-input(
        v-if="addMarkType === '其他'",
        v-model="addMarkOther",
        trim,
        placeholder="... 自訂界標種類 ...",
        :state="addMarkOtherOK"
      )
    template(#modal-footer="{ ok, cancel, hide }")
      b-button(
        @click="addMark",
        :variant="addBtnDisabled ? 'outline-secondary' : 'primary'",
        :disabled="addBtnDisabled"
      ) 確認
  
  b-collapse.mt-1(
    v-model="detail"
    @shown="showCollapsed"
  )
    b-list-group.small(v-if="marks.length > 0 && detail", ref="marks-detail", flush)
      b-list-group-item.p-1(v-for="(mark, idx) in marks", :key="`mark_${idx}`"): MarkItem(
        :raw="raw",
        :land-number="landNumber",
        :mark="mark",
        :open="collapseAll"
        @remove="removeMark(idx)"
      )
</template>

<script>
import isEmpty from "lodash/isEmpty";
import CaseBase from "~/components/CaseBase.js";

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true },
    landCreator: { type: String, require: true },
    openAll: { type: Boolean, default: false }
  },
  mixins: [CaseBase],
  data: () => ({
    detail: true,
    collapseAll: false,
    addMarkType: "其他",
    addMarkOpts: ["鋼釘", "塑膠樁", "水泥樁", "噴漆", "其他"],
    addMarkOther: "",
    addMarkSerial: 1
  }),
  computed: {
    collapseIcon() { return this.detail ? "caret-up" : "caret-down"; },
    collapseVariant() { return this.detail ? "outline-primary" : "outline-secondary"; },
    addMarkOtherOK() { return !isEmpty(this.addMarkOther); },
    addMarkSerialOK() {
      const found = this.marks.find((mark) => {
        return parseInt(mark.serial) === parseInt(this.addMarkSerial);
      });
      if (found) {
        return false;
      }
      return /^\+?(0|[1-9]\d*)$/.test(this.addMarkSerial);
    },
    addBtnDisabled() {
      if (!this.addMarkSerialOK) {
        return true;
      }
      if (this.addMarkType === "其他" && !this.addMarkOtherOK) {
        return true;
      } else if (this.addMarkOpts.includes(this.addMarkType) || (this.addMarkType === "其他" && this.addMarkOtherOK)) {
        return false;
      }
      return true;
    },
    isOwner() {
      return this.landCreator === this.userId;
    },
    collapseIcon() {
      return this.detail ? "caret-down" : "caret-right";
    },
    formatedLandNumber() {
      return `${this.landNumber.substring(0, 4)}-${this.landNumber.substring(4)}`;
    },
    land() {
      return this.raw.lands.find((land, idx, arr) => {
        return land.number === this.landNumber;
      });
    },
    marks() {
      return this.land.marks || [];
    },
    markCount() {
      const found = this.raw.lands.find((land, idx, arr) => {
        return land.number === this.landNumber;
      });
      const marks = found?.marks || [];
      return marks.length;
    },
    markType() {
      if (this.addMarkType === "其他") {
        return this.addMarkOther;
      }
      return this.addMarkType;
    }
  },
  created() {
    this.incrementAddMarkSerial();
    this.collapseAll = this.openAll;
  },
  methods: {
    incrementAddMarkSerial() {
      this.addMarkSerial = (parseInt(Math.max(...this.marks.map(mark => mark.serial))) || 0) + 1;
    },
    removeLandNumber() {
      this.$emit("remove", this.landNumber);
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
          caseData: {
            year: this.formatedYear,
            code: this.formatedCode,
            num: this.formatedNum
          },
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
    addMark() {
      try {
        this.isBusy = true;
        this.marks.push({
          doc: this._id,  // parent doc _id
          year: this.formatedYear,
          code: this.formatedCode,
          num: this.formatedNum,
          opdate: this.opdate,
          section: this.sectionCode.toString(),
          number: this.landNumber,
          serial: this.addMarkSerial.toString(),
          creator: this.userId,
          type: this.markType,
          idx: this.marks.length  // for quickly know the position of this mark in the array
        });
        this.updateLandData();
        this.$refs["add-mark-modal"].hide();
        this.incrementAddMarkSerial();
      } catch (e) {
        console.error(e);
      } finally {
        this.isBusy = false
      }
    },
    removeMark(index) {
      try {
        this.isBusy = true;
        this.marks.splice(index, 1);
        this.updateLandData();
      } catch (e) {
        console.error(e);
      } finally {
        this.isBusy = false
      }
    },
    showCollapsed() {
      if (this.$refs['marks-detail']) {
        this.$refs['marks-detail'].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
