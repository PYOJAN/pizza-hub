// webpack.mix.js

let mix = require("laravel-mix");
require("mix-tailwindcss");

mix
  .sourceMaps()
  .webpackConfig({ devtool: "inline-source-map" })
  .js("resources/js/app.js", "js")
  // .js("resources/js/404.js", 'js/404.js')
  .sass("resources/scss/style.scss", "css")
  .tailwind("./tailwind.config.js")
  .setPublicPath("public");
