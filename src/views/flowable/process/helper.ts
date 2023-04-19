import {processDefinitionStatistics} from "@/service";
import {useLoading} from "@/hooks";
import {groupBy} from "lodash-es";
import {ref} from 'vue'

export const loadListProcessResultStatistics = () => {

  const items = ref<ProcessResult[]>([])
  const {loading, startLoading, endLoading} = useLoading(true);
  const loadData = async () => {
    startLoading();
    const {data} = await processDefinitionStatistics();
    endLoading();
    if (data) {
      items.value = uniqueByDefinitionKey(data)
    }
  }
  return {
    loading,
    items,
    loadData
  }
}
const uniqueByDefinitionKey = (list: ApiFlowManagement.ProcessStatisticsResult[]): ProcessResult[] => {
  const groups = groupBy(list, (i: ApiFlowManagement.ProcessStatisticsResult) => i.definition.key)
  return Object.keys(groups)
    .map(key => {
      const list = groups[key]
      const incidents = list.reduce((accumulate: number, current: ApiFlowManagement.ProcessStatisticsResult) => {
        return accumulate + current.incidents.length
      }, 0)
      const runningInstances = list.reduce((accumulate: number, current: ApiFlowManagement.ProcessStatisticsResult) => {
        return accumulate + current.instances
      }, 0)
      const processDefinitions = list.map(i => i.definition);
      processDefinitions.sort((p, a) => a.version - p.version)
      return {
        name: processDefinitions[0].name || processDefinitions[0].key,
        latestId: processDefinitions[0].id,
        incidents,
        runningInstances,
        processDefinitions,
      }
    })
}
