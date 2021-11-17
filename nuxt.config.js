export default {
  ssr: false,

  server: {
    // bind to all possible addresses
    host: '0.0.0.0'
  },

  dev: process.env.NODE_ENV !== 'production',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '界標閱覽系統-桃園市桃園地政事務所',
    htmlAttrs: {
      lang: 'zh_TW'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/global.css'
  ],
  
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/global-mixin' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/composition-api/module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/localforage'
  ],

  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true,
    config: {
      // Custom config options here
    }
  },

  styleResources: {
    scss: '@/assets/scss/_variables.scss',
    scss: '@/assets/scss/_site.scss'
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    // Options
    strategies: {
      local: {
        token: {
          property: 'token',
          type: 'Bearer',
          name: 'Authorization',
          maxAge: process.env.NODE_ENV === 'production' ? 1800 : 3600,
          global: true,
          required: true,
          prefix: '_token.',
          expirationPrefix: '_token_expiration.'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        clientId: true,
        grantType: false,
        scope: false,
        endpoints: {
          login: { url: `/api/login`, method: 'post', propertyName: 'data.token' },
          user: { url: `/api/me`, method: 'get' },
          logout: { url: `/api/logout`, method: 'post' }
        }
      }
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.baseUrl || `http://localhost:3000`,
    proxy: true,
    credentials: false,
    https: process.env.PROTOCOL === 'https',
    debug: false
  },

  proxy: {
    '/api': {
      target: `http://${process.env.API_HOST}:${process.env.API_PORT}`,
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {},
    babel: { compact: true }
  }
}
