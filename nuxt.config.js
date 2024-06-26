import fs from 'fs';
import path from 'path';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const isProd = process.env.NODE_ENV === "production";
const protocol = process.env.PROTOCOL === "https" ? "https" : "http";
const apiHost = isProd ? process.env.API_HOST : "localhost";
const apiPort = process.env.API_PORT || "4500";

export default {
  ssr: false,

  server: {
    // bind to all possible addresses
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key', process.env.NODE_ENV === 'production' ? 'server.key' : 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'key',  process.env.NODE_ENV === 'production' ? 'server.crt' : 'localhost.pem'))
    }
  },

  dev: !isProd,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '測量即可拍系統-桃園市地政局',
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
  
  // Customize the progress-bar color
  loading: {
    color: '#FFC0CB'
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
          maxAge: isProd ? 14400 : 28800,
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
    baseURL: process.env.baseUrl || `${protocol}://localhost:${process.env.PORT || 3000}`,
    proxy: true,
    credentials: false,
    https: protocol === "https",
    debug: false
  },

  proxy: {
    '/api': {
      target: `${protocol}://${apiHost}:${apiPort}`,
      secure: false,  // ignore "UNABLE_TO_VERIFY_LEAF_SIGNATURE" fail
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    },
    '/mark': {
      target: `${protocol}://${apiHost}:${apiPort}`,
      secure: false,  // ignore "UNABLE_TO_VERIFY_LEAF_SIGNATURE" fail
      changeOrigin: true,
      pathRewrite: { '^/mark': '' }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {},
    babel: { compact: true }
  },
  // should hold all env variables that are public as these will be exposed on the frontend.
  // available using $config in both server and client.
  publicRuntimeConfig: {
    protocol: protocol,
    serverPort: process.env.PORT,
    apiHost: apiHost,
    apiPort: apiPort,
    isProd: isProd
  },
  // should hold all env variables that are private and that should not be exposed on the frontend.
  // only available on server using same $config
  // privateRuntimeConfig always overrides publicRuntimeConfig on server-side. $config in server mode is { ...public, ...private } but for client mode only { ...public }
  privateRuntimeConfig: {
    apiKey: "secret"
  }
}
