const logerror = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.data)
    console.error(error.response.status)
    console.error(error.response.headers)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message)
  }
  console.error(error.config)
}

const timestamp = () => {
  // e.g. 2020-12-03 10:23:00
  const now = new Date()
  return now.getFullYear() + '-' +
    ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
    ('0' + now.getDate()).slice(-2) + ' ' +
    ('0' + now.getHours()).slice(-2) + ':' +
    ('0' + now.getMinutes()).slice(-2) + ':' +
    ('0' + now.getSeconds()).slice(-2)
}

const logtimestamp = (message) => {
  const ts = timestamp()
  console.log(`${ts} ${message}`)
}

const state = () => ({
  ip: ''
})

const getters = {
  // @nuxtjs/auth will add user/loggedIn in store
  loggedIn: state => state.auth?.loggedIn,
  user: state => state.auth?.user,
  ip: state => state.ip
}

// only sync operation
const mutations = {
  // login (state, payload) { state.auth = { ...state.auth, ...payload } },
  ip (state, payload) { state.ip = payload }
}

// support async operation
const actions = {
  // Nuxt provided hook feature for Vuex, calling at server side when store initializing
  nuxtServerInit ({ commit, dispatch }, nuxt) {
    try {
      commit('ip', nuxt.req.connection.remoteAddress || nuxt.req.socket.remoteAddress)
      // restore user session
      // nuxt.req.session.user && commit('user', nuxt.req.session.user)
    } catch (e) {
      console.error(e)
    }
  },
  // checkSession ({ commit, getters }) {
  // }
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
  strict: false
}
