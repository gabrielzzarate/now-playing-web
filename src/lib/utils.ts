import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'

export const isServer = typeof window === 'undefined'

export function flattenObject(
  _obj: Record<string, any>,
  _path: string[] = []
): Record<string, any> {
  const _flattenObject = (obj: Record<string, any>, path: string[]): Record<string, any> => {
    return !isPlainObject(obj)
      ? { [path.join('.')]: obj }
      : Object.entries(obj).reduce(
          (acc, [key, value]) => merge(acc, _flattenObject(value, [...path, key])),
          {}
        )
  }

  return _flattenObject(_obj, _path)
}
