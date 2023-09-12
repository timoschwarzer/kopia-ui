import {MaybeRef} from 'vue'
import {useToDate} from '~/lib/useToDate'
import {format as formatDate} from 'date-fns'

export function useFormatDate(input: MaybeRef<number | string | Date>, format: MaybeRef<string>) {
  return computed(() => {
    const value = useToDate(input)
    return formatDate(value.value, unref(format))
  })
}