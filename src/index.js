// import data from './data.json'
// import './style.css'

// function fn(){
//   console.log('fn1', data)
// }
// fn()

class Person {
  constructor(name) {
    this.name = name
  }
  setName(name) {
    this.name = name
  }
}
console.log(new Person('jack'))