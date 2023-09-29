import {MaybeRef, Ref} from 'vue'
import {Get} from 'type-fest'

export const isUndefined = (v: any) => v === undefined
export const isNull = (v: any) => v === null
export const isNullOrUndefined = (v: any) => isNull(v) || isUndefined(v)
export const isFalsy = (v: any) => !v

/**
 * This effect exposes a single property of a possibly multi-level object as a Ref, while removing the property and
 * any empty objects if the value is set to an empty value defined by the isEmptyFn function.
 *
 * Example:
 *
 * ```js
 * const myObject = ref({
 *   foo: {
 *     bar: 3,
 *   },
 *   baz: 5,
 * })
 *
 * const bar = useOptionalObjectValue(myObject, isUndefined, 'foo', 'bar')
 *
 * // bar.value is 3
 *
 * bar.value = 6
 *
 * // myObject.value is {
 * //   foo: {
 * //     bar: 6,
 * //   },
 * //   baz: 5,
 * // }
 *
 * bar.value = undefined
 *
 * // myObject.value is {
 * //   baz: 5,
 * // }
 * //
 * // myObject.value.foo.bar was removed and myObject.value.foo was
 * // removed since it was an empty object afterwards
 * ```
 *
 *
 * @param object
 * @param isEmptyFn
 * @param propertyChain
 */
export function useOptionalObjectValue<T, PathType extends string[]>(object: MaybeRef<T>, isEmptyFn: (v: any) => boolean, ...propertyChain: PathType): Ref<Get<T, PathType> | undefined> {
  if (propertyChain.length === 0) {
    console.error('useOptionalObjectValue: Property chain must contain at least one entry.')
    return ref(undefined)
  }

  const objectRef = toRef(object)

  return computed<Get<T, PathType> | undefined>({
    get() {
      let obj: any | undefined = objectRef.value

      for (const propertyName of propertyChain) {
        if (obj === undefined) {
          return obj
        }

        obj = obj[propertyName]
      }

      return obj as Get<T, PathType>
    },
    set(newValue) {
      if (isUndefined(newValue)) {
        let firstMissingPropertyIndex = 0
        let objHierarchy: [any] = [objectRef.value]
        for (let i = 0; i < propertyChain.length; i++) {
          if (!(propertyChain[i] in objHierarchy[i])) {
            firstMissingPropertyIndex = i
            break
          }

          // If we reached the value property, delete it
          if (i === propertyChain.length - 1) {
            delete objHierarchy[i][propertyChain[i]]
            firstMissingPropertyIndex = i
            break
          }

          objHierarchy.push(objHierarchy[i][propertyChain[i]])
        }

        // Bubble up and delete objects if they are empty
        for (let i = firstMissingPropertyIndex - 1; i >= 0; i--) {
          if (Object.keys(objHierarchy[i][propertyChain[i]]).length > 0) {
            break
          }

          delete objHierarchy[i][propertyChain[i]]
        }
      } else {
        let obj: any = objectRef.value

        // Create missing sub objects
        for (let i = 0; i < propertyChain.length - 1; i++) {
          const propertyName = propertyChain[i]

          let subObj = obj[propertyName]

          if (subObj === undefined) {
            subObj = {}
            obj[propertyName] = subObj
            obj = subObj
            continue
          }

          obj = subObj
        }

        // Set the actual value
        obj[propertyChain[propertyChain.length - 1]] = newValue
      }
    },
  })
}