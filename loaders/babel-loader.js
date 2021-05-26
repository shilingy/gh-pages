const path = require('path')
const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')
const babalSchema  = require('./babalSchema.json')
const babel = require('@babel/core')
const util = require('util')

// babel.transform用来编译代码的方法,是一个普通异步的方法
// util.promisify是将普通异步方法转化为基于promise的异步方法
const transform = util.promisify(babel.transform)

module.exports = function (content, map, meta) {
  // 获取loader的options配置
  const options = getOptions(this) || {}
  // 校验loader的options配置
  validate(babalSchema, options, 'babel loader')
  // 创建一个异步方法
  const callback = this.async()
  // 使用babel
  transform(content, options)
  .then(({code, map})=> { callback(null, code, map, meta) })
  .catch((e)=> { callback(e) })

}
