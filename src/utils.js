export const isObject = value => Object.prototype.toString.call(value) === '[object Object]'

export const createCacheStore = () => {
  if (typeof WeakMap === 'undefined') {
    throw Error('please add WeakMap polyfill')
  }
  return new WeakMap()
}
