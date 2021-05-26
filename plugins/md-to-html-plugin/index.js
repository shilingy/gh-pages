const { resolve } = require('path')
const { readFileSync } = require('fs')

const INNER_MARK = "<!-- inner -->"

class MdToHtmlPlugin {
  constructor({template, filename}) {
    if(!template) {
      throw new Error("The Config for 'template' must be configured!")
    }
    this.template = template
    this.filename = filename
  }
  apply(compiler) {
    compiler.hooks.emit.tap('MdToHtmlPlugin', (compilation)=> {
      const _assets = compilation.assets;
      const _mdContent = readFileSync(this.template, 'utf8')
      const _templateHTML = readFileSync(resolve(__dirname, 'template.html')).toString()
      // const _mdContentArr = _mdContent.split('\n')
      // const _htmlStr = compileHTML(_mdContentArr)
      const _finalHTML = _templateHTML.replace(INNER_MARK, _mdContent)

      _assets[this.filename] = {
        source() {
          return _finalHTML
        },
        size () {
          return _finalHTML.length
        }
      }
    })
    
  }
}

module.exports = MdToHtmlPlugin