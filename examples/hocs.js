import lodash from 'lodash'

export const delay = lodash.delay

export const throttle = lodash.throttle

export const log = fn => (...args) => {
  const name = fn ? fn.name : 'anonymity'
  console.log(`[log] ${name} before: `, ...args)
  const result = fn(...args)
  console.log(`[log] ${name} after: `, result)
  return result
}

export const operateWhenDev = fn => (...args) => {
  if (process.env.NODE_ENV === 'development') {
    return fn(...args)
  }
}

export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
