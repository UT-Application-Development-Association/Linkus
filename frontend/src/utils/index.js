export const isNone = val => val === null || typeof val === 'undefined'
export const isEmptyObject = val => !isNone(val) && Object.keys(val).length === 0

export const pick = (obj, ...keys) => {
  const result = Object.create(null)

  keys.forEach((k) => {
    if (Object.hasOwnProperty.call(obj, k)) {
      result[k] = obj[k]
    }
  })

  return result
}