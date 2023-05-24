import {useLoading} from "@/hooks";
import {formDefinitions} from "@/service";
import {ref} from "vue";
import {groupBy} from 'lodash-es'

export const loadFormList = () => {
  return loadFormListByMapFunc((arr) => arr)
}
export const loadFormListGroupKey = () => {
  return loadFormListByMapFunc(groupByKey)
}


type FormDefListMapFunc = (arr: ApiFlowManagement.FormDefinition[]) => ApiFlowManagement.FormDefinition[]

export const loadFormListByMapFunc = (func: FormDefListMapFunc) => {
  const {loading, startLoading, endLoading} = useLoading()
  const items = ref<Array<ApiFlowManagement.FormDefinition>>([])
  const loadData = async (req?: Partial<ApiFlowManagement.FormDefinitionQuery>) => {
    startLoading();
    const {data} = await formDefinitions(req);
    endLoading();
    if (data) {
      items.value = func(data)
    }
  }
  return {
    loading,
    loadData,
    items
  }
}

function groupByKey(arr: ApiFlowManagement.FormDefinition[]) {
  const group = groupBy(arr, (i: ApiFlowManagement.FormDefinition) => i.key);
  return Object.keys(group)
    .map(key => {
      const list = group[key]
      list.sort((p, a) => a.version - p.version)
      return list[0]
    })

}

