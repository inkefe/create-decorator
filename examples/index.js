import createDecorator from 'create-decorator'
import { compose, log, operateWhenDev, throttle } from './hocs'

const sendMsg = (...args) => {
  console.log('sendMsg: ', ...args)
  return args
}

console.log('%%%%%%%%%%%%%%% 高阶函数compose %%%%%%%%%%%%%%%')
compose(log, operateWhenDev, fn => throttle(fn, 3000))(sendMsg)('老铁 666')
console.log('')

const logDecorator = createDecorator(log)
const operateWhenDevDecorator = createDecorator(operateWhenDev)
const throttleDecorator = wait => createDecorator(throttle, wait)

console.log('%%%%%%%%%%%%%%% es6装饰器compose %%%%%%%%%%%%%%%')
compose(logDecorator, operateWhenDevDecorator, throttleDecorator(3000))(sendMsg)('老铁 888')
console.log('')

class Chat {
  socket = 'new Socket'

  /**
   * 静态函数 普通函数
   */
  @logDecorator
  @operateWhenDevDecorator
  @throttleDecorator(3000)
  static extend (...args) {
    console.log('extend: ', this && this.name, ...args)
    return args
  }

  /**
   * 静态函数 箭头函数
   */
  @logDecorator
  @operateWhenDevDecorator
  @throttleDecorator(3000)
  static extendArrow = (...args) => {
    console.log('extend: ', this.name, ...args)
    return args
  }

  /**
   * 箭头函数
   */
  @logDecorator
  @operateWhenDevDecorator
  @throttleDecorator(3000)
  sendGift = (...args) => {
    console.log('sendGift: ', this.socket, ...args)
    return args
  }

  /**
   * 普通函数
   */
  @logDecorator
  @operateWhenDevDecorator
  @throttleDecorator(1000)
  onChange (...args) {
    console.log('onChange: ', this && this.socket, ...args)
    return args
  }
}

class Person {
  constructor (name) {
    this.name = name
  }

  @logDecorator
  getNameArrow = () => {
    console.log(this.name)
  }

  @logDecorator
  getNameNormal () {
    console.log(this.name)
  }
}

const p1 = new Person('p1')
p1.getNameArrow()
p1.getNameNormal()
const p2 = new Person('p2')
p2.getNameArrow()
p2.getNameArrow()

const { extend, extendArrow } = Chat

console.log('%%%%%%%%%%%%%%% static arrow function %%%%%%%%%%%%%%%')
extendArrow('Component Arrow')
console.log('')

console.log('%%%%%%%%%%%%%%% static function %%%%%%%%%%%%%%%')
extend('Component')
console.log('')

const chat = new Chat()
const { sendGift, onChange } = chat


console.log('%%%%%%%%%%%%%%% prototype function %%%%%%%%%%%%%%%')
sendGift('火箭')
console.log('')

console.log('%%%%%%%%%%%%%%% prototype arrow function %%%%%%%%%%%%%%%')
onChange('开始输入')
console.log('')
