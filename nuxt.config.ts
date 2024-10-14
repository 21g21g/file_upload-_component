// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules:['@nuxtjs/tailwindcss', 'vue3-carousel-nuxt','@vee-validate/nuxt'],
  runtimeConfig:{
    public:{
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  }
}

}



)