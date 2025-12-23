// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'DOME Trust Registry',
      link: [
        {rel: 'icon', type: 'image/png', href: '/dome_logo_favicon.png'},
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"}
      ]
    }
  },
  css: ['@/assets/base.css'],
  modules: [
    '@nuxtjs/robots',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  runtimeConfig: {
    public:{
      apiMainUri: process.env.NUXT_PUBLIC_API_MAIN_URI || '',
      apiHost: process.env.NUXT_PUBLIC_API_HOST || '',
      apiHealth: process.env.NUXT_API_HEALTH || '',
      clientId: process.env.NUXT_PUBLIC_CLIENT_ID || '',
      authServer: process.env.NUXT_PUBLIC_AUTH_SERVER || '',
      tokenServer: process.env.NUXT_PUBLIC_TOKEN_SERVER || '',
      codeLength: process.env.NUXT_PUBLIC_CODE_LENGTH || 64,
      codeAlgo: process.env.NUXT_PUBLIC_CODE_ALGO || 'SHA-256',
      stateLength: process.env.NUXT_PUBLIC_STATE_LENGTH || 16,
      challengeMethod: process.env.NUXT_PUBLIC_CHALLENGE_METHOD || 'S256'
    }
  },
  vite: {
    build: {
      minify: false
    },
    esbuild: {
      drop: []
    }
  }
})
