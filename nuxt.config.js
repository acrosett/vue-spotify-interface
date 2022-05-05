export default {
  // ... 
  plugins: ['~/plugins/services.plugin.js'],
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  },
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  build: {
    loaders: {
      sass: {
        implementation: require('sass'),
      },
      scss: {
        implementation: require('sass'),
      },
    },
  }
}