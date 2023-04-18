import type {Ref} from 'vue'

export function usePropertyTip(...observes: Ref[]) {
  return computed(() => {
    return observes.filter((item) => {
      const v = item.value
      if (v instanceof String || v instanceof Array) {
        return !!v && v.length > 0
      }
      return !!v
    }).length > 0
  })
}
