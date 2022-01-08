/* eslint-disable */
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  transpileDependencies: ["vuex-module-decorators"],
  publicPath: "/",
  //css and scss
  css:{
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/themes/index.scss";`
      },
      // sass: {
      //   additionalData: `@import "~@/themes/index.scss";`
      // }
    }
  },
  //plugins
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
};
