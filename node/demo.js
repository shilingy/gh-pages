const http = require('http')
const url = require('url')
const fs = require('fs')
const querystring = require('querystring')

const assert = require('assert') // assert的用途 assert（断言）通常用来对代码进行校验，若出错则阻止程序运行，并抛出一个错误。
// assert(2 > 1, '2 > 1')
// assert(1 > 2, '1 > 2')
const path = require('path')

const str = '/root/a/b/1.txt'

console.log(path.dirname(str))  // 获取文件目录：/root/a/b
console.log(path.basename(str)) // 获取文件名：1.txt
console.log(path.extname(str)) // 获取文件后缀：.txt
console.log(path.resolve(str, '../c', 'build', 'strict')) // 将路径解析为绝对路径：/root/a/b/c/build/strict
console.log(path.resolve(str, '../c', 'build', 'strict', '../..', 'assets')) // 将路径解析为绝对路径：/root/a/b/c/assets
console.log(path.resolve(__dirname, 'build')) // 将路径解析为绝对路径：/Users/sly/Desktop/vite/webpack-test/node/build
// 值得一提的是path.resolve方法，它可以接收任意个参数，然后根据每个路径参数之间的关系，将路径最终解析为一个绝对路径。
// __dirname指的是当前模块所在的绝对路径名称，它的值会自动根据当前的绝对路径变化，等同于path.dirname(__filename)的结果。


const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // 简单处理一下跨域
  // 定义公共变量，存储请求方法、路径、数据
  const method = req.method
  let path = ''
  let get = {}
  let post = {}

  // 判断请求方法为GET还是POST，区分处理数据
  if (method === 'GET') {
    // 使用url.parse解析get数据
    const { pathname, query } = url.parse(req.url, true)

    path = pathname
    get = query

    complete()
  } else if (method === 'POST') {
    path = req.url
    let arr = []

    req.on('data', (buffer) => {
      // 获取POST请求的Buffer数据
      arr.push(buffer)
    })

    req.on('end', () => {
      // 将Buffer数据合并
      let buffer = Buffer.concat(arr)

      // 处理接收到的POST数据
      post = JSON.parse(buffer.toString())

      complete()
    })
  }

  // 在回调函数中统一处理解析后的数据
  function complete() {
    try {
      if (path === '/reg') {
        // 获取get请求数据
        const {
          username,
          password
        } = get

        // 读取user.json文件
        fs.readFile('./users.json', (error, data) => {
          if (error) {
            res.writeHead(404)
          } else {
            // 读取用户数据
            const users = JSON.parse(data.toString())
            const usernameIndex = users.findIndex((item) => {
              return username === item.username
            })

            // 判断用户名是否存在
            if (usernameIndex >= 0) {
              res.write(JSON.stringify({
                error: 1,
                msg: '此用户名已存在'
              }))
              res.end()
            } else {
              // 用户名不存在则在用户列表中增加一个用户
              users.push({
                username,
                password
              })

              // 将新的用户列表保存到user.json文件中
              fs.writeFile('./users.json', JSON.stringify(users), (error) => {
                if (error) {
                  res.writeHead(404)
                } else {
                  res.write(JSON.stringify({
                    error: 0,
                    msg: '注册成功'
                  }))
                }
                res.end()
              })
            }
          }
        })
      } else if (path === '/login') {
        const {
          username,
          password
        } = post

        // 读取users.json
        fs.readFile('./users.json', (error, data) => {
          if (error) {
            res.writeHead(404)
          } else {
            // 获取user列表数据
            const users = JSON.parse(data.toString())
            const usernameIndex = users.findIndex((item) => {
              return username === item.username
            })

            if (usernameIndex >= 0) {
              // 用户名存在，则校验密码是否正确
              if (users[usernameIndex].password === password) {
                res.write(JSON.stringify({
                  error: 0,
                  msg: '登录成功'+username
                }))
              } else {
                res.write(JSON.stringify({
                  error: 1,
                  msg: '密码错误'
                }))
              }
            } else {
              res.write(JSON.stringify({
                error: 1,
                msg: '该用户不存在'
              }))
            }
          }
          res.end()
        })
      } else {
        // 若不是注册或登录接口，则直接返回相应文件
        path === '/' && (path = '/index.html')
        fs.readFile(`.${path}`, (error, data) => {
          if (error) {
            res.writeHead(404)
          } else {
            res.write(data)
          }
          res.end()
        })
      }
    } catch (error) {
      console.error(error);
    }
  }
})

server.listen(8080, () => {
  console.log(`RUN IN: http://localhost:8080`)
})