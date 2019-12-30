export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#333'},
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '@/plugins/element-ui', ssr: true},
    '@/plugins/axios',
    '@/plugins/router',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    credentials: true,
    baseURL: "正式服链接"
  },
  proxy: {
    '/oauth/': {
      target: 'http://192.168.0.100:8080/oauth/',
      pathRewrite: {'^/oauth': ''},
      changeOrigin: true,
    },
    '/merch/': {
      target: 'http://192.168.0.100:8080/merch/',
      pathRewrite: {'^/merch/': ''},
      changeOrigin: true,
    },
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },
  router: {
    linkExactActiveClass: 'exact-active-link',//全局配置 <nuxt-link> 默认的active class。
    linkActiveClass: 'active-link',//全局配置 <nuxt-link> 组件默认的激活类名。
    linkPrefetchedClass: 'nuxt-link-prefetched',//全局配置<nuxt-link>默认值(默认情况下禁用功能),
  }
}
