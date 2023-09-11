import prettyBytes from 'pretty-bytes'
import {MaybeRef} from 'vue'

export function usePrettyBytes(input: MaybeRef<number | null | undefined>) {
  return computed(() => {
    const value = unref(input)
    return value ? prettyBytes(value) : '-'
  })
}