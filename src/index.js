import { isObject, createBaseMapStore } from './utils'

/**
 * 创建装饰器, 所创建的装饰器支持普通函数、类prototype下面的函数、类prototype下面的箭头函数、类的静态函数的装饰, 而且能固定this;
 * 等于在`core-decorators`下的autoBind和decorate双装饰的功能基础上, 增加了静态函数, 箭头函数, 普通函数的装饰, 代码量更精简下, 满足更多场景
 * @param {Function} hocWrapper 基础函数的高阶函数
 * @author libx@inke.cn
 * @example
 * 1. 创建装饰器
 * const xxxDecorator = createDecorator(fn => (...args) => xxx, ...firstArgs)
 * // 与第三方高阶函数结合
 * const xxxDecorator = createDecorator(lodash.throlled, 300)
 * 2. 使用装饰器
 * 2.1 普通函数
 * const fnProxy = xxxDecorator(fn)
 * const fnProxyComposed = compose(xxxDecorator2, xxxDecorator1)(fn)
 *
 * 2.2 类
 * class A {
 *  @xxxDecorator
 *  static fn() {}
 *
 *  @createDecorator(lodash.throttled, 300)
 *  @xxxDecorator
 *  fn() {}
 *
 *  @xxxDecorator
 *  fnArrow = () => {}
 * }
 */
const createDecorator = function (hocWrapper, ...args) {
  if (typeof hocWrapper !== 'function') throw Error('[create-decorator]: createDecorator请传入一个高阶函数')

  return function handleDescriptor (target, key, descriptor) {
    if (!descriptor && typeof target === 'function') {
      // 返回执行具体业务逻辑的函数
      return hocWrapper(target)
    }

    if (descriptor && !isObject(descriptor)) {
      throw Error('[create-decorator]: 装饰器使用错误, descriptor不是描述对象, 请检查@decorator是否为正确装饰器结构: function (target, name, descriptor) { ... }', 'descriptor: ', descriptor)
    }

    const { configurable, enumerable, writable } = descriptor;
    const originalGet = descriptor.get
    const originalSet = descriptor.set
    let originalValue = descriptor.value
    const originInitializer = descriptor.initializer
    const isGetter = !!originalGet
    const defaultSetter = newValue => (originalValue = newValue)
    const store = createBaseMapStore()

    const desc = {
      configurable,
      enumerable,
    }

    // 当非箭头函数 或 静态箭头函数时候, 不能有即有initializer 和 value(get、set)属性
    // 构建报错如(Invalid property descriptor Cannot both specify accesssors and a value or writable attirbute)
    // 所以这里将initializer 与 get set区分开
    if (typeof originInitializer === 'function') {
      desc.initializer = function initializer () {
        if (!store.get(this)) {
          // 这边在编译时候, 将this传入作用域curry起来, 等于间接固定了this
          // 这个realMethod是类中的具体执行业务逻辑的函数
          const realMethod = originInitializer.call(this).bind(this)
          // 这个是通过高阶函数装饰之后的代理函数, 调用者调用的就是这个函数
          store.set(this, hocWrapper.call(this, realMethod, ...args))
        }
        const wrappedFn = store.get(this)
        return function realMethodCall (...nextArgs) {
          return wrappedFn.call(this, ...nextArgs)
        }
      }
    } else {
      desc.get = function get () {
        const wrappedFn = store.get(this)
        if (wrappedFn) return wrappedFn

        let realMethod
        if (isGetter) {
          realMethod = originalGet.call(this).bind(this)
        } else if (typeof originalValue === 'function') {
          realMethod = originalValue.bind(this)
        } else {
          throw Error('[create-decorator]: descriptor\'s `value` or `get` property is not a function', descriptor)
        }

        store.set(this, hocWrapper.call(this, realMethod, ...args))
        return store.get(this)
      }
      desc.set = isGetter ? originalSet : defaultSetter
    }

    return desc
  }
}

// eslint-disable-next-line no-undef
const version = __VERSION__

createDecorator.version = version

export {
  version,
  createDecorator
}

export default createDecorator
