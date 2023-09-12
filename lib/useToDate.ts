import {ComputedRef, MaybeRef} from 'vue'

export function useToDate(input: MaybeRef<number | string | Date>): ComputedRef<Date>
export function useToDate(input: MaybeRef<null | undefined>): ComputedRef<null>
export function useToDate(input: MaybeRef<number | string | Date | null | undefined>) {
  return computed(() => {
    const value = unref(input)
    return value ? new Date(value) : null
  })
}