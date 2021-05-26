
const { SyncHook, SyncBailHook, AsyncParallelHook,AsyncSeriesHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      // 同步hooks，任务依次执行
      // go: new SyncHook(['adress'])
      go: new SyncBailHook(['adress']), // 一旦遇到返回值就不会向下执行了

      // 异步hooks，异步并行
      // leave: new AsyncParallelHook(['name', 'age']),
      // 异步hooks，异步串行
      leave: new AsyncSeriesHook(['name', 'age']),
    }
  }
  tap() {
    // 往hooks容器中注册事件/添加回调函数
    this.hooks.go.tap('class01', (adress) => {
      console.log('测试同步01', adress)
      return 1
    })
    this.hooks.go.tap('class02', (adress) => {
      console.log('测试同步02', adress)
    })
    // tapAsync
    this.hooks.leave.tapAsync('class03', (name, age, cb) => {
      setTimeout(()=> {
        console.log('测试异步03', name, age)
        cb() // 如果cb里面有参数例如：cb('参数值') 导致tapPromise不能执行
      }, 2000)
    })
    // tapPromise
    this.hooks.leave.tapPromise('class04', (name, age) => {
      return new Promise((resolve)=> {
        setTimeout(()=> {
          console.log('测试异步04', name, age)
          resolve()
        }, 1000)
      })
    })
  }

  satrt() {
    //  触发hooks
    this.hooks.go.call('上海市')
    this.hooks.leave.callAsync('sly', 18, (params) => {
      // 代表所有leave容器中的函数触发完了，才触发这里
      console.log('所有异步', params);
    })
  }
}
const l = new Lesson()
l.tap()
l.satrt()