import {defineStore} from 'pinia'
import {reactive} from "vue";
import configs from '../../configs'

export const useAppStore = defineStore("app", () => {

  const config = reactive(configs)
  return {
    ...config
  }
})
