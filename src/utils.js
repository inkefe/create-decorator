export const isObject = value => Object.prototype.toString.call(value) === '[object Object]'

const createBaseCacheStore = () => {
  const mapStore = new WeakMap()
  return function cacheStore () {
    return mapStore
  }
}

export const createBaseMapStore = createBaseCacheStore()