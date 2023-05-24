import {refillValue, START_EVENT_ACT, USER_TASK_ACT} from "@/views/myprocess/list/task/helper";
import {
  processDefinitionStartForm,
  processDefinitionDeployedStartForm,
  historicTaskForm, historicTaskDeployedForm
} from '@/service'
import {useLoading} from "@/hooks";
import {ref} from 'vue'

export const loadForm = (act: ApiFlowManagement.HistoricActivityInstance, variables?: ApiFlowManagement.VariableInstance[]) => {
  const form = ref<ApiFlowManagement.deployedForm>()
  const {loading, startLoading, endLoading} = useLoading()
  const fetch = async () => {
    startLoading()
    if (act.activityType == START_EVENT_ACT) {
      const {data} = await processDefinitionStartForm(act.processDefinitionId)
      if (data && data.camundaFormRef && data.camundaFormRef.key) {
        const {data: deployed} = await processDefinitionDeployedStartForm(act.processDefinitionId)
        if (deployed) {
          form.value = deployed
        }
      }
    } else if (act.activityType == USER_TASK_ACT) {
      if (act.taskId) {
        const {data} = await historicTaskForm(act.taskId)
        if (data && data.camundaFormRef && data.camundaFormRef.key) {
          const {data: deployed} = await historicTaskDeployedForm(act.taskId)
          if (deployed) {
            form.value = deployed
          }
        }
      }
    }
    endLoading()
    if (form.value && variables) {
      refillValue(form.value.components, variables)
    }
  }
  return {
    loading,
    fetch,
    form
  }
}
