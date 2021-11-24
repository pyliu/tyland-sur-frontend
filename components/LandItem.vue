<template lang="pug">
.text-left
  .d-flex.justify-content-between.align-items-center
    div(v-b-tooltip="`建立人：${userMap.get(landCreator) || landCreator}`") {{ formatedLandNumber }}
    b-badge.mx-1(variant="secondary", pill, title="界標數") {{ markCount }}
    b-button.border-0.p-0(
      v-if="isOwner && markCount === 0",
      size="sm",
      variant="outline-danger",
      :title="`刪除地號 ${formatedLandNumber}`",
      @click="removeLandNumber"
    ) ❌
    b-button.ml-auto(
      size="sm",
      variant="outline-primary",
      :title="`在地號 ${formatedLandNumber} 裡新增界標`",
      v-b-modal="addMarkModalId"
    ) 新增界標
  b-modal(
    ref="add-mark-modal",
    :id="addMarkModalId",
    :title="`新增界標 - ${formatedLandNumber}`",
    centered
  )
    b-form-group(label="種類")
      b-radio-group(v-model="addMarkType", :options="addMarkOpts", stacked)
      b-input(
        v-if="addMarkType === '其他'",
        v-model="addMarkOther",
        trim,
        placeholder="... 自訂界標種類 ..."
      )
    template(#modal-footer="{ ok, cancel, hide }")
      b-button(
        @click="addMark",
        :variant="addBtnDisabled ? 'outline-secondary' : 'primary'",
        :disabled="addBtnDisabled"
      ) 確認
</template>

<script>
import isEmpty from "lodash/isEmpty";
import CaseBase from "~/components/CaseBase.js";

export default {
  emit: ["remove"],
  props: {
    landNumber: { type: String, require: true },
    landCreator: { type: String, require: true }
  },
  mixins: [CaseBase],
  data: () => ({
    addMarkModalId: "",
    addMarkType: "其他",
    addMarkOpts: ["鋼釘", "塑膠樁", "水泥樁", "其他"],
    addMarkOther: ""
  }),
  computed: {
    addBtnDisabled() {
      if (this.addMarkType === "其他" && isEmpty(this.addMarkOther)) {
        return true;
      } else if (["鋼釘", "塑膠樁", "水泥樁"].includes(this.addMarkType)) {
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
    this.addMarkModalId = this.uuid();
  },
  methods: {
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
          serial: this.markCount + 1,
          creator: this.userId,
          type: this.markType
        });
        this.updateLandData();
        this.$refs["add-mark-modal"].hide();
      } catch (e) {
        console.error(e);
      } finally {
        this.isBusy = false
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
