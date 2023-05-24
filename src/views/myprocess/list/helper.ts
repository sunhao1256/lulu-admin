import {useLoading} from "@/hooks";
import {ref} from "vue";
import {tasks} from "@/service";
import {debounce, groupBy} from 'lodash-es'

export type TaskWithPd = ApiFlowManagement.Task & { process?: ApiFlowManagement.ProcessDefinition }

export const loadTaskList = () => {
  const {loading, startLoading, endLoading} = useLoading()
  const items = ref<Array<TaskWithPd>>([])
  const count = ref<number>(0)
  const loadData = debounce(async (req?: Partial<ApiFlowManagement.TaskQuery>) => {
    startLoading();
    const {data} = await tasks(req);
    endLoading();
    if (data) {
      count.value = data.count
      items.value = setProcess(data._embedded.task, data._embedded.processDefinition)
    }
  }, 250)
  return {
    loading,
    loadData,
    count,
    items
  }
}


function setProcess(task: ApiFlowManagement.Task[], process: ApiFlowManagement.ProcessDefinition[]) {
  const processByIdMap = groupBy(process, (p: ApiFlowManagement.ProcessDefinition) => p.id)
  return task.map(t => {
    const p = processByIdMap[t.processDefinitionId]
    const n: TaskWithPd = {
      ...t,
      process: p.length > 0 ? p[0] : undefined
    }
    return n
  })
}

