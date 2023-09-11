import prettyMilliseconds from 'pretty-ms'
import {MaybeRef} from 'vue'

export function usePrettyMs(input: MaybeRef<number>) {
  return computed(() => prettyMilliseconds(unref(input)))
}