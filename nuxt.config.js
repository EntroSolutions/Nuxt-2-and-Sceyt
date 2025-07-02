export default {
  head: {
    title: 'Sceyt Chat App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Real-time chat application built with Nuxt 2 and Sceyt' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '~/assets/css/main.css'
  ],

  plugins: [
    '~/plugins/sceyt.client.js'
  ],

  components: true,

  buildModules: [
    '@nuxtjs/tailwindcss'
  ],

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    baseURL: '/'
  },

  build: {
    extend(config, { isClient }) {
      if (isClient) {
        config.node = {
          fs: 'empty'
        }
      }
    }
  }
} 