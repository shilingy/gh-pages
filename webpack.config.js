/**
 * mode development p[roduction
 * entry 入口文件
 * output path filename 打包输出路径
 * devtool source-map
 * module rules loader
 * plugins 插件
 * devServer 开发服务器
 */

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('./plugins/CopyWebpackPlugin')
const MdToHtmlPlugin = require('./plugins/md-to-html-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  // 配置loader解析规则，配置loader解析路径
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(jpg|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false,
              name: "img/[hash:10].[ext]"
            }
          }
        ],
        type: 'javascript/auto'
      },
      {
        test: /\.(html)$/,
        use: [
          'html-loader',
          {
            loader: 'checkout-loader',
            options: {
              name: 'sly',
              age: 18
            }
          }
          
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
          
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin({
      from: 'public',
      // to: '.',
      ignore: ['index.html']
    }),
    new MdToHtmlPlugin({
      template: path.resolve(__dirname, 'test.md'),
      filename: 'test.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true
  }
}