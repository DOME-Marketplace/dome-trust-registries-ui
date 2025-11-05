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
  css: ['@/assets/base.css']
})
