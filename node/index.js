const http = require('http')
const url = require('url')
const { createReadStream, createWriteStream } = require('fs')

const hostname = "127.0.0.1"
const port = 3000
// const api = "https://www.bilibili.com/video/BV16f4y1U7oT?name=yixiu"
// nodemon、supervisor
// CommonJs（package.json包描述文件\bin存放可执行的二进制文件的目录\lib存放js代码的目录\doc存放文档的目录）

// 创建 Web 服务器。
const server = http.createServer((req, res) => { 
  console.log(11, req.url)
  if(req.url !== '/favicon.ico') {
    const getValue = url.parse(req.url, true).query // url.parse()已经弃用了
  }
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('charset', 'utf-8')
  res.write('hello nodeJS 1111')
  res.end() // 也是用来向前端返回数据
});
// 启动服务器
server.listen(port, () => {
  console.log('服务器已启动');
  // 停止服务器
  // server.close(() => {
  //   console.log('服务器已停止');  
  // });
});

// createReadStream 读取流
const readStream = createReadStream('./a.txt')
let str = '123'
let count = 0
readStream.on('data',(data) => {
  count++
  str+=data
})

readStream.on('end',() => {
  console.log(count)
})

readStream.on('error',(error) => {
  console.log(error)
})


// createWriteStream 写入流 
const writeStream = createWriteStream('./copya.txt')
writeStream.write(str)
writeStream.end()
writeStream.on('finish', (data) => {
  console.log('写入完成')
})

// 管道流pipe() 主要用于复制文件
const pipeReadStream = createReadStream('./a.txt')
const pipeWriteStream = createWriteStream('./api/a.txt')
pipeReadStream.pipe(pipeWriteStream)