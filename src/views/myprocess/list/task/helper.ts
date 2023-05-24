import {task, processDefinitionDeployedStartForm, historicActIns, variableInstance, taskDeployedForm} from '@/service'
import {ref} from 'vue'
import {keyBy} from 'lodash-es'
import {useLoadingProgressLine} from "@/components/provider";
import {useLoading} from "@/hooks";
import VariableInstance = ApiFlowManagement.VariableInstance;

export const getTask = () => {
  const t = ref<ApiFlowManagement.HalTask>()
  const loading = useLoadingProgressLine()
  const deployedForm = ref<ApiFlowManagement.deployedForm>()
  const fetch = async (id: string) => {
    loading.show()
    const {data} = await task(id)
    if (data) {
      t.value = data
    }
    if (!t.value?.processDefinitionId)
      return

    if (t.value?.camundaFormRef && t.value?.camundaFormRef.key) {
      const {data: dataForm} = await taskDeployedForm(id)
      if (dataForm) {
        deployedForm.value = dataForm
      }
    }

    loading.hide()
  }
  return {
    loading,
    fetch,
    t,
    deployedForm
  }
}

export const getHistoryActIns = () => {
  const {loading, startLoading, endLoading} = useLoading()
  const actIns = ref<ApiFlowManagement.HistoricActivityInstance[]>([])
  const fetch = async (req: Partial<ApiFlowManagement.HistoricActInsQuery>) => {
    startLoading()
    const {data} = await historicActIns(req)
    if (data) {
      actIns.value = data
    }
    endLoading()
  }
  return {
    loading,
    fetch,
    actIns
  }

}


export const getStartFormData = () => {

  const loading = useLoadingProgressLine()
  const startForm = ref<ApiFlowManagement.deployedForm>()
  const fetch = async (pd: string) => {
    loading.show()
    const {data: startFormData} = await processDefinitionDeployedStartForm(pd)
    if (startFormData) {
      startForm.value = startFormData
    }
    loading.hide()
  }

  return {
    fetch,
    startForm
  }
}

export const getVariablesByPInstanceId = () => {
  const {loading, startLoading, endLoading} = useLoading()

  const variables = ref<ApiFlowManagement.VariableInstance[]>([])
  const fetch = async (pd: string) => {
    startLoading()
    const {data: startFormData} = await variableInstance({
      processInstanceIdIn: [pd]
    }, {})
    if (startFormData) {
      variables.value = startFormData
    }
    endLoading()
  }
  return {
    loading,
    fetch,
    variables
  }

}

export const refillValue = (components: formComponent[], variables: ApiFlowManagement.VariableInstance[]) => {
  if (variables.length == 0 || components.length == 0)
    return
  const map = keyBy(variables, (a) => a.name)
  recursiveFill(components, map)
}

function recursiveFill(components: formComponent[], variableMap: Record<string, VariableInstance>) {
  components.forEach(c => {
    if (c.config.formChildren) {
      recursiveFill(c.config.formChildren, variableMap)
    }
    if (c.id && variableMap[c.id]) {
      c.modelValue = variableMap[c.id].value
    }
  })
}


export const START_EVENT_ACT = 'startEvent'
export const USER_TASK_ACT = 'userTask'
export const supportForm = (actIns: ApiFlowManagement.HistoricActivityInstance) => {
  return actIns.activityType === START_EVENT_ACT || actIns.activityType === USER_TASK_ACT
}
