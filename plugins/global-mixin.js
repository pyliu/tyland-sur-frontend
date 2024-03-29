import isEmpty from "lodash/isEmpty";
import Vue from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

// inject to all Vue instances
Vue.mixin({
  data: () => ({
    // codes: codeMap,
    // sections: sectionMap,
    isBusy: false,
  }),
  computed: {
    ...mapGetters(["loggedIn", "user", "userId", "site", "ip", "statusCode", "wip", "wipList", "userList", "users", "userMap", "authMap", "codes", "sections", "loaded"]),
    today() {
      const now = new Date();
      return now.toLocaleDateString('zh-TW').replaceAll('/', '-');
    },
    userName() {
      return this.user?.name;
    },
    userNote() {
      return this.user?.note;
    },
    userAuthority() {
      const authInt = parseInt(this.user?.authority || 0);
      const authority = {
        isAdmin: (authInt & 1) === 1
      };
      return authority;
    },
    userTokenHash() {
      return this.user?.token.hash;
    },
    userExpire() {
      return this.user?.token.expire;
    },
    loaded() {
      return this.codes.size > 0 && this.sections.size > 0
    }
  },
  methods: {
    ...mapActions(["checkSession"]),
    ...mapMutations([]),
    uuid() {
      var d = Date.now();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },
    now() {
      // e.g. 2020-11-06 13:39:23
      const now = new Date();
      return (
        now.getFullYear() +
        "-" +
        ("0" + (now.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + now.getDate()).slice(-2) +
        " " +
        ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2) +
        ":" +
        ("0" + now.getSeconds()).slice(-2)
      );
    },
    isEmpty,
    makeToast(message, opts = {}) {
      // skip making toast when document is not visible
      if (document && document.hidden) {
        console.warn("document is hidden ... skip makeToast message", message);
        return;
      }
      return new Promise((resolve, reject) => {
        if (this.$isServer) {
          reject("Server side doesn't use toast");
        } else if (this.$bvToast) {
          // position adapter
          switch (opts.pos) {
            case "tr":
              opts.toaster = "b-toaster-top-right";
              break;
            case "tl":
              opts.toaster = "b-toaster-top-left";
              break;
            case "br":
              opts.toaster = "b-toaster-bottom-right";
              break;
            case "bl":
              opts.toaster = "b-toaster-bottom-left";
              break;
            case "tc":
              opts.toaster = "b-toaster-top-center";
              break;
            case "tf":
              opts.toaster = "b-toaster-top-full";
              break;
            case "bc":
              opts.toaster = "b-toaster-bottom-center";
              break;
            case "bf":
              opts.toaster = "b-toaster-bottom-full";
              break;
            default:
              // override the position by type/variant
              switch (opts.variant) {
                case "danger":
                case "red":
                  opts.toaster = "b-toaster-top-full";
                  break;
                case "warning":
                case "yellow":
                  opts.toaster = "b-toaster-bottom-full";
                  break;
                default:
                  opts.toaster = "b-toaster-bottom-right";
              }
          }
          // merge default setting
          const merged = Object.assign(
            {
              title: "通知",
              subtitle: this.now().split(" ")[1],
              href: "",
              noAutoHide: false,
              autoHideDelay: 5000,
              solid: true,
              toaster: "b-toaster-bottom-right",
              appendToast: true,
              variant: "info",
            },
            opts
          );
          // Use a shorter name for this.$createElement
          const h = this.$createElement;
          // Create the title
          const vNodesTitle = h(
            "div",
            {
              class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"],
            },
            [
              h(
                "strong",
                {
                  class: "mr-2",
                },
                merged.title
              ),
              h(
                "small",
                {
                  class: "ml-auto text-italics",
                },
                merged.subtitle
              ),
            ]
          );
          // Pass the VNodes as an array for title
          merged.title = [vNodesTitle];
          // use vNode for HTML content
          const msgVNode = h("div", {
            domProps: {
              innerHTML: message,
            },
          });

          this.$bvToast.toast([msgVNode], merged);

          // resolve the final opts back
          merged.message = message;
          resolve(merged);
        } else {
          reject(new Error("No this.$bvToast, toast window can not be shown"));
        }
      });
    },
    notify(msg, opts = { title: "🗨 通知" }) {
      return new Promise((resolve, reject) => {
        if (typeof msg !== "string" && typeof opts !== "object") {
          reject(`notify 傳入參數有誤: msg:${msg}, opts: ${opts}`);
        } else {
          const defDelay =
            opts.variant === "danger"
              ? 10000
              : opts.variant === "warning"
              ? 7500
              : 5000;
          if (typeof msg === "string") {
            opts.variant = opts.type || opts.variant || "info";
            opts.autoHideDelay = opts.duration || opts.delay || defDelay;
          } else if (typeof msg === "object") {
            opts = msg;
            // previous API only use one object param
            msg = opts.body || opts.message;
            opts.variant = opts.type || opts.variant || "info";
            opts.autoHideDelay = opts.duration || opts.delay || defDelay;
          }
          this.makeToast(msg, opts)
            .then((config) => {
              resolve(config);
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        }
      });
    },
    success(message, opts = {}) {
      if (!isEmpty(message)) {
        const merged = Object.assign(
          {
            title: "🟢 成功",
            autoHideDelay: 15000,
            pos: "tr",
            variant: "success",
          },
          opts
        );
        this.notify(message, merged);
      }
    },
    warning(message, opts = {}) {
      if (!isEmpty(message)) {
        const merged = Object.assign(
          {
            title: "🟡 警示",
            autoHideDelay: 15000,
            pos: "tr",
            variant: "warning",
          },
          opts
        );
        this.notify(message, merged);
      }
    },
    alert(message, opts = {}) {
      if (!isEmpty(message)) {
        if (opts && opts.pos === "bottom") {
          opts.pos = "bf";
        } else if (opts && opts.pos === "top") {
          opts.pos = "tf";
        }
        const merged = Object.assign(
          {
            title: "🔴 錯誤",
            autoHideDelay: 20000,
            variant: "danger",
          },
          opts
        );
        this.notify(message, merged);
      }
    },
    showModalById(id) {
      this.$bvModal && this.$bvModal.show(id);
    },
    hideModalById(id) {
      this.$bvModal && this.$bvModal.hide(id);
    },
    showModal (id) {
      this.showModalById(id || 'dynamic-modal-control')
    },
    hideModal (id) {
      this.hideModalById(id || 'dynamic-modal-control')
    },
    modal(message, opts) {
      return new Promise((resolve, reject) => {
        if (this.$isServer) {
          reject("Server side doesn't use modal");
        } else if (this.$bvModal) {
          const merged = Object.assign(
            {
              id: 'dynamic-modal-control', // used for show/close by programming
              title: "訊息",
              size: "md",
              buttonSize: "sm",
              okVariant: "outline-secondary",
              okTitle: "關閉",
              hideHeaderClose: false,
              centered: true,
              scrollable: true,
              hideFooter: true,
              noCloseOnBackdrop: false,
              noFade: false,
              contentClass: "shadow",
              html: false,
              root: false,
            },
            opts
          );
          // use d-none to hide footer
          merged.footerClass = merged.hideFooter ? "d-none" : "p-2";
          if (typeof message === "object") {
            // assume the message is VNode
            message = [message];
          } else if (merged.html) {
            // HTML message content
            merged.titleHtml = merged.title;
            merged.title = undefined;
            const msgVNode = this.$createElement("div", {
              domProps: { innerHTML: message },
            });
            message = [msgVNode];
          }
          // https://bootstrap-vue.org/docs/components/modal#modal-message-boxes
          const modal = merged.root ? this.$root.$bvModal : this.$bvModal;
          modal
            .msgBoxOk(message, merged)
            .then((val) => {
              // val will be always true from $bvModal.msgBoxOk window closed
            })
            .catch((err) => {
              reject(err);
            });
          // resolve the final opts back
          merged.message = message;
          resolve(merged);
        } else {
          reject(new Error("No this.$bvModal, modal window can not be shown"));
        }
      });
    },
    confirm(message, opts = {}) {
      return new Promise((resolve, reject) => {
        if (this.$isServer) {
          reject("Server side doesn't use confirm");
        } else if (this.$bvModal) {
          const merged = Object.assign(
            {
              title: "請確認",
              size: "sm",
              buttonSize: "sm",
              okVariant: "outline-success",
              okTitle: "確定",
              cancelVariant: "secondary",
              cancelTitle: "取消",
              footerClass: "p-2",
              hideHeaderClose: false,
              noCloseOnBackdrop: false,
              centered: true,
              contentClass: "shadow",
            },
            opts
          );
          // use HTML content
          const h = this.$createElement;
          const msgVNode = h("div", { domProps: { innerHTML: message } });
          this.$bvModal
            .msgBoxConfirm([msgVNode], merged)
            .then((value) => {
              resolve(value); // true, false or null
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(
            new Error("No this.$bvModal, confirm window can not be shown")
          );
        }
      });
    },
    trigger(evtName, payload) {
      if (CustomEvent) {
        const evt = new CustomEvent(evtName, {
          detail: payload,
          bubbles: true,
        });
        Object.defineProperty(evt, "target", {
          writable: false,
          value: this.$el,
        });
        this.$emit(evtName, evt);
        return evt;
      } else {
        console.warn("CustomEvent not defined?");
      }
    },
    setCache(key, val, expire_timeout = 0) {
      if (isEmpty(key) || this.$localForage === undefined) {
        return false;
      }
      try {
        const item = {
          key,
          value: val,
          timestamp: +new Date(), // == new Date().getTime()
          expire_ms: expire_timeout, // milliseconds
        };
        this.$localForage
          .setItem(key, item)
          .then((value) => {
            // Do other things once the value has been saved.
          })
          .catch((err) => {
            // This code runs if there were any errors
            console.error(err);
          });
      } catch (err) {
        console.error(err);
        return false;
      }
      return true;
    },
    async getCache(key) {
      if (isEmpty(key) || this.$localForage === undefined) {
        return false;
      }
      try {
        const item = await this.$localForage.getItem(key);
        if (isEmpty(item)) {
          return false;
        }
        const ts = item.timestamp;
        const expireTime = item.expire_ms || 0;
        const now = +new Date();
        // console.log(`get ${key} value. (expireTime: ${expireTime}), now - ts == ${now - ts}`, item.value)
        if (expireTime !== 0 && now - ts > expireTime) {
          await this.$localForage.removeItem(key);
          // console.log(`${key} is removed. (expireTime: ${expireTime}), now - ts == ${now - ts}`)
          return false;
        } else {
          return item.value;
        }
      } catch (err) {
        console.error(err);
      }
      return false;
    },
    async getCacheExpireRemainingTime(key) {
      if (isEmpty(key) || this.$localForage === undefined) {
        return false;
      }
      try {
        const item = await this.$localForage.getItem(key);
        if (isEmpty(item)) {
          return false;
        }
        const ts = item.timestamp;
        const expireTime = item.expire_ms || 0;
        const now = +new Date();
        // console.log(`get ${key} value. (expireTime: ${expireTime}), now - ts == ${now - ts}`, item.value)
        if (expireTime === 0) {
          return false;
        } else {
          return expireTime - (now - ts); // milliseconds
        }
      } catch (err) {
        console.error(err);
      }
      return false;
    },
    async removeCache(key) {
      if (isEmpty(key) || this.$localForage === undefined) {
        return false;
      }
      try {
        await this.$localForage.removeItem(key);
      } catch (err) {
        console.error(err);
      }
      return true;
    },
    async clearCache() {
      await this.$localForage.clear();
    },
    async prepareUserMap(force = false) {
      try {
        if (force) {
          this.removeCache('usersCache');
          this.userMap.clear();
          this.authMap.clear();
        }
        const users = await this.getCache('usersCache');
        if (Array.isArray(users) && users.length > 0 ) {
          // commit users raw data to store
          this.$store.commit('users', users);
          // refresh Map data
          users.forEach(user => {
            this.userMap.set(user.id, user.name);
            this.authMap.set(user.id, user.authority);
          });
        } else {
          await this.$store.dispatch('prepareUserMap');
          setTimeout(() => {
            // const array = Array.from(this.userMap, ([id, name]) => ({ id, name }));
            const expire = this.$auth.strategies.local.options.token.maxAge || 1800;
            this.setCache('usersCache', this.userList, expire * 1000);
            process.env.NODE_ENV !== 'production' && console.log(`儲存 ${this.userList.length} 筆使用者資料 ${expire} 秒後到期`);
          }, 2000);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async loadSiteData(force = false) {
      try {
        if (this.site && (force || !this.loaded)) {
          const codesRes = await this.$axios.get(`/api/codes/${this.site}`);
          this.codes.clear();
          codesRes?.data?.payload?.forEach((element) => {
            this.codes.set(element.value, element.text);
          });
          const sectionsRes = await this.$axios.get(`/api/sections/${this.site}`);
          this.sections.clear();
          sectionsRes?.data?.payload?.forEach((element) => {
            this.sections.set(element.value, element.text);
          });
        }
      } catch (e) {
        console.warn(e);
      }
    },
    clearWipState() {
      this.$store.commit("wip", {});
      this.$store.commit("wipList", []);
    },
    clearStoreState() {
      // clear store state
      this.clearWipState();
      this.codes?.clear();
      this.sections?.clear();
    }
  }
});
