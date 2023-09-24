// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  ssr: false,
  nitro: {
    static: true,
  },
  modules: [
    '@invictus.codes/nuxt-vuetify',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
  ],
  css: [
    '@mdi/font/css/materialdesignicons.css',
  ],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: '#245bae',
              accent: '#2a7fff',
            }
          }
        }
      },
    },
    moduleOptions: {
      /* nuxt-vuetify module options */
      treeshaking: true,
      useIconCDN: false,

      /* vite-plugin-vuetify options */
      autoImport: true,
      useVuetifyLabs: true,
    },
  },
})
