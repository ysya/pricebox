// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    errorHandler: '~/server/error-handler.ts'
  },
  modules: ['@unocss/nuxt', '@vueuse/nuxt', '@pinia/nuxt', ['nuxt-quasar-ui', {
    plugins: [
      'Notify',
      'Dialog'
    ],
    extras: {
      font: 'roboto-font',
      fontIcons: ['material-icons']
    },
  }], 'nuxt-quasar-ui', '@vueuse/nuxt'],
  quasar: {
    components: {
      defaults: {
        QBtn: {
          outline: true
        },
        QInput: {
          outlined: true
        },
        QSelect: {
          outlined: true
        },
        QTable: {
          flat: true,
          bordered: true,
        }
      }
    }
  },
  unocss: {
    nuxtLayers: true,
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },
})