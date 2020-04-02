"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.createDecorator = exports.version = void 0;

var _utils = require("./utils");

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
var createDecorator = function createDecorator(hocWrapper) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (typeof hocWrapper !== 'function') throw Error('[create-decorator]: createDecorator请传入一个高阶函数');
  return function handleDescriptor(target, key, descriptor) {
    if (!descriptor && typeof target === 'function') {
      // 返回执行具体业务逻辑的函数
      return hocWrapper(target);
    }

    if (descriptor && !(0, _utils.isObject)(descriptor)) {
      throw Error('[create-decorator]: 装饰器使用错误, descriptor不是描述对象, 请检查@decorator是否为正确装饰器结构: function (target, name, descriptor) { ... }', 'descriptor: ', descriptor);
    }

    var configurable = descriptor.configurable,
        enumerable = descriptor.enumerable,
        writable = descriptor.writable;
    var originalGet = descriptor.get;
    var originalSet = descriptor.set;
    var originalValue = descriptor.value;
    var originInitializer = descriptor.initializer;
    var isGetter = !!originalGet;

    var defaultSetter = function defaultSetter(newValue) {
      return originalValue = newValue;
    };

    var wrappedFn;
    var desc = {
      configurable: configurable,
      enumerable: enumerable
    }; // 当非箭头函数 或 静态箭头函数时候, 不能有即有initializer 和 value(get、set)属性
    // 构建报错如(Invalid property descriptor Cannot both specify accesssors and a value or writable attirbute)
    // 所以这里将initializer 与 get set区分开

    if (typeof originInitializer === 'function') {
      desc.initializer = function initializer() {
        if (!wrappedFn) {
          // 这边在编译时候, 将this传入作用域curry起来, 等于间接固定了this
          // 这个realMethod是类中的具体执行业务逻辑的函数
          var realMethod = originInitializer.call(this).bind(this); // 这个是通过高阶函数装饰之后的代理函数, 调用者调用的就是这个函数

          wrappedFn = hocWrapper.call.apply(hocWrapper, [this, realMethod].concat(args));
        }

        return function realMethodCall() {
          var _wrappedFn;

          for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            nextArgs[_key2] = arguments[_key2];
          }

          return (_wrappedFn = wrappedFn).call.apply(_wrappedFn, [this].concat(nextArgs));
        };
      };
    } else {
      desc.get = function get() {
        if (wrappedFn) return wrappedFn;
        var realMethod;

        if (isGetter) {
          realMethod = originalGet.call(this).bind(this);
        } else if (typeof originalValue === 'function') {
          realMethod = originalValue.bind(this);
        } else {
          throw Error('[create-decorator]: descriptor\'s `value` or `get` property is not a function', descriptor);
        }

        wrappedFn = hocWrapper.call.apply(hocWrapper, [this, realMethod].concat(args));
        return wrappedFn;
      };

      desc.set = isGetter ? originalSet : defaultSetter;
    }

    return desc;
  };
}; // eslint-disable-next-line no-undef


exports.createDecorator = createDecorator;
var version = "0.1.3";
exports.version = version;
createDecorator.version = version;
var _default = createDecorator;
exports["default"] = _default;