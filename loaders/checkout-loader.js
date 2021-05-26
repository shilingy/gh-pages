const path = require('path')
const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')
const schema  = require('./schema.json')


module.exports = function (source) {
  const options = getOptions(this) || {}
  console.log(111, options)
  validate(schema, options, "checkout-loader")
  return source
}

// module.exports.pitch = function (params) {
// }
