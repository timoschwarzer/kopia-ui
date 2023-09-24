import prettyBytes from 'pretty-bytes'
import {MaybeRef} from 'vue'

export function usePrettyBytes(input: MaybeRef<number | null | undefined>, showZero: boolean = false) {
  return computed(() => {
    const value = unref(input)
    return (value || showZero) ? prettyBytes(value ?? 0) : '-'
  })
}