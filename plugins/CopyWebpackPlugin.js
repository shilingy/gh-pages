const { validate } = require('schema-utils')
const schema = require('./schema.json')

class CopyWebpackPlugin {
  constructor(options = {}) {
    // 验证options是否符合规范
    validate(schema, options, {
      name: 'CopyWebpackPlugin'
    })
    this.options = options
  }
  apply(compiler) {
    // 初始化compilation
    compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation)=> {
      // 添加资源的hooks
      compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', (cb)=> {
        // 将form资源复制到to中，输出出去
        // 1.读取from中所有资源
        // 2.过滤掉ignore的文件
        // 3.生成webpack格式的资源
        // 4.添加compilation中，输出出去
        cb()
      })
    })
  }
}

module.exports = CopyWebpackPlugin