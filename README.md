# create-decorator

## 项目简介

1. **这个库有什么用?**

虽然高阶函数可以对函数进行包装, 但是对于类而言, 直接使用`es6的decorator`对类进行装饰写法会更简洁也更可读, 如:

```js
// hoc
class A {
  constructor () {
    this.sendMsg = needLogin(this.sendMsg)
  }
  sendMsg = () => {}
}

// es6 decorator
class A {
  @needLogin
  sendMsg = () => {}
}
```

那么如何将一个高阶函数快速转换为一个es6可以认识的装饰器呢? 可以参考[decorate](https://github.com/jayphelps/core-decorators#decorate)

2. **那么`createDecorator`与`core-decorators`的`decorate`有什么区别?**

- 支持箭头函数写法的装饰(decorate没实现), 并且内置了`绑定this`, 用起来更简洁
- 双兼容, 即通过`createDecorator`创建的装饰器即可以对类进行装饰, 还可以保留继续对普通的函数进行包装的功能

综上: `createDecorator`是一个万能的`装饰器创造器`

## 安装

```sh
# dependencies
npm install @inkefe/create-decorator -D

# devDependencies
npm install @inkefe/create-decorator -S
```

## 使用文档

**第一步: 创建装饰器**

```js
import createDecorator from '@inkefe/create-decorator'
import lodash from 'lodash'

const xxxDecorator = createDecorator(fn => (...args) => xxx, ...firstArgs)

// 与第三方高阶函数结合
const xxxDecorator = createDecorator(lodash.throlled, 300)
```

**第二步使用装饰器**

1. 普通函数结合

```js
import { compose } from 'redux'

const fn = () => { console.log('具体的业务函数') }

// 已创建的装饰器, 继续可以当做之前的高阶函数使用, 对fn进行装饰, 也支持compose
const fnProxy = xxxDecorator(fn)

const fnProxyComposed = compose(xxxDecorator2, xxxDecorator1)(fn)
```

2. 与类结合

兼容以下四种情况

```js
class A {
  // 兼容静态函数
  @xxxDecorator
  static fn () {}

  // 静态函数箭头函数
  @xxxDecorator
  static fn = () => {}

  // prototype下函数
  @createDecorator(lodash.throttled, 300)
  @xxxDecorator
  fn () {}

  // prototype下箭头函数
  @xxxDecorator
  fnArrow = () => {}
}

```

## 项目介绍

1. 可以在`src`目录下进行开发, 通过`npm run example`

1. ***开发完成一定要维护README***, ***开发完成一定要维护README***, ***开发完成一定要维护README***

1. 构建

```sh
npm run build
```

会构建到lib目录下: `${module-name}.development.js` 和 `${module-name}.production.min.js`

8. 发布

```sh
# 补丁迭代
npm run publish:patch

# 小版本迭代
npm run publish:minor

# 大版本迭代
npm run publish:major
```

会将代码发布到npm中[inkefe](https://www.npmjs.com/settings/inkefe/packages)组下, 如果没有权限请联系`李宝旭`or`leader`开通npm组权限

9. 在[CHANGELOG.md](./CHANGELOG.md)中维护修改内容
