const isDev = process.env.NODE_ENV !== "production";

const logerror = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", error.message);
  }
  console.error(error.config);
};

const timestamp = () => {
  // e.g. 2020-12-03 10:23:00
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
};

const logtimestamp = (message) => {
  const ts = timestamp();
  console.log(`${ts} ${message}`);
};

const state = () => ({
  ip: "",
  statusCode: {
    SUCCESS: 1,
    FAIL: 0,
    FAIL_AUTH: -1,
    FAIL_NOT_FOUND: -2,
    FAIL_DUPLICATED: -3,
    FAIL_EXPIRE: -4,
    FAIL_NOT_IMPLEMENTED: -5,
    FAIL_NOT_CHANGED: -6
  },
  wipCase: {},
  wipList: [],
  userList: [],
  userMap: new Map(),
  authMap: new Map(),
  codes: new Map(),
  sections: new Map()
});

const getters = {
  // @nuxtjs/auth will add user/loggedIn in store
  loggedIn: (state) => state.auth?.loggedIn,
  user: (state) => state.auth?.user,
  userId: (state) => state.auth?.user?.id,
  site: (state) => {
    const site = state.auth?.user?.id?.substring(0, 2);
    return site?.toUpperCase();
  },
  ip: (state) => state.ip,
  statusCode: (state) => state.statusCode,
  wip: (state) => state.wipCase,
  wipList: (state) => state.wipList,
  userList: (state) => state.userList ,
  users: (state) => state.userList ,
  userMap: (state) => state.userMap,
  authMap: (state) => state.authMap,
  codes: (state) => state.codes,
  sections: (state) => state.sections
};

// only sync operation
const mutations = {
  ip(state, payload) {
    state.ip = payload;
  },
  wip(state, payload) {
    state.wipCase = { ...payload };
  },
  wipList(state, payload) {
    state.wipList = [...payload];
  },
  codes(state, payload) {
    state.codes = payload;
  },
  sections(state, payload) {
    state.sections = payload;
  },
  users(state, payload) {
    state.userList = [...payload];
  }
};

// support async operation
const actions = {
  // Nuxt provided hook feature for Vuex, calling at server side when store initializing
  nuxtServerInit({ commit, dispatch }, nuxt) {
    try {
      commit(
        "ip",
        nuxt.req.connection.remoteAddress || nuxt.req.socket.remoteAddress
      );
    } catch (e) {
      console.error(e);
    }
  },
  prepareUserMap({ commit, getters }) {
    isDev && console.log('查詢 user 以初始化 userMap ... ');
    this.$axios
      .post("/api/user", {})
      .then(({ data }) => {
        isDev && console.log(data.message);
        if (data.statusCode > 0) {
          const users = data.payload;
          if (Array.isArray(users)) {
            commit('users', users);
            /**
             * user obj e.g. {
              authority: 0,
              id: "HATEST",
              name: "HATEST",
              note: "test",
              pwd: "2a4c124add170ac85243ab9649aa97f7",
              token: {hash: '487f7b22f68312d2c1bbc93b1aea445b', expire: 1669606900727},
              _id: "63842df593e58b86220f7e17"
             }
             */
            users.forEach((user) => {
              getters.userMap.set(user.id, user.name);
              getters.authMap.set(user.id, user.authority);
            });
          } else {
            console.warn(`payload 不是陣列，無法初始化 userMap。`, users);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }
};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
  strict: false,
};
