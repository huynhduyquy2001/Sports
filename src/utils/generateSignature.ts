import { createHmac } from 'crypto'

function sortObjDataByKey(object: Record<string, any>): Record<string, any> {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {})
  return orderedObject
}

function convertObjToQueryStr(object: Record<string, any>): string {
  return Object.keys(object)
    .filter(key => object[key] !== undefined)
    .map(key => {
      let value = object[key]
      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map(val => sortObjDataByKey(val)))
      }
      // Set empty string if null
      if ([null, undefined, 'undefined', 'null'].includes(value)) {
        value = ''
      }

      return `${key}=${value}`
    })
    .join('&')
}

export function generateSignature(data: Record<string, any>, checksumKey: string): string {
  const sortedDataByKey = sortObjDataByKey(data)
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey)
  const dataToSignature = createHmac('sha256', checksumKey).update(dataQueryStr).digest('hex')
  console.log(dataToSignature)
  return dataToSignature || ''
}
