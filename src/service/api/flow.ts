import {request} from '../request';
import {cockpitPrefix, enginePrefix, HalJsonHeader} from "@/service";

export function processDefinitionGroupProcessDefinitionList(id: string) {
  return request.get<ApiFlowManagement.ProcessDefinitionGroup.ProcessDefinition[]>(`/process-definition/group/${id ? id : ''}/process-definition`);
}

export function processDefinitionGroupList() {
  return request.get<ApiFlowManagement.ProcessDefinitionGroup[]>(`/process-definition/group`);
}

export function processDefinitionGroupAdd(body: Partial<ApiFlowManagement.ProcessDefinitionGroup>) {
  return request.post<ApiFlowManagement.ProcessDefinitionGroup[]>(`/process-definition/group`, body);
}

export function deploymentCreate(d: Partial<ApiFlowManagement.deployCreate>) {
  return request.post(`/deployment/create`, {...d}, {
    headers: {"Content-Type": "multipart/form-data"},
  });
}

export function deploymentList(d: ApiFlowManagement.deployList) {
  const query = obj2query(d);
  return request.get<ApiFlowManagement.deployment[]>(`${enginePrefix}/deployment?${query}`);
}

export function deploymentCount(d: ApiFlowManagement.deployList) {
  const query = obj2query(d);
  return request.get<{ count: number }>(`${enginePrefix}/deployment/count?${query}`);
}

export function deploymentDelete(d: string, p: Partial<ApiFlowManagement.deployDeleteQuery>) {
  const query = obj2query(p);
  return request.delete(`${enginePrefix}/deployment/${d}?${query}`);
}

export function deploymentResources(d: string) {
  return request.get<ApiFlowManagement.resource[]>(`${enginePrefix}/deployment/${d}/resources`);
}

export function deploymentResourceData(d: string, r: string) {
  return request.get<{
    id: string,
    components: formComponent[]
  }>(`${enginePrefix}/deployment/${d}/resources/${r}/data`);
}

export function processDefinitionStatistics() {
  return request.get<ApiFlowManagement.ProcessStatisticsResult[]>(`${enginePrefix}/process-definition/statistics?incidents=true`)
}

export function processDefinitionXml(processDefinitionId: string) {
  return request.get<ApiFlowManagement.ProcessDefinitionXmlResult>(`${enginePrefix}/process-definition/${processDefinitionId}/xml`)
}

export function processDefinition(processDefinitionId: string) {
  return request.get<ApiFlowManagement.ProcessDefinition>(`${enginePrefix}/process-definition/${processDefinitionId}`)
}

export function processDefinitionSuspended(processDefinitionId: string, data: Partial<ApiFlowManagement.ProcessDefinitionSuspendedParam>) {
  return request.put(`${enginePrefix}/process-definition/${processDefinitionId}/suspended/`, data)
}

export function processDefinitions(d: Partial<ApiFlowManagement.ProcessDefinitionsQuery>) {
  const query = obj2query(d);
  return request.get<ApiFlowManagement.ProcessDefinition[]>(`${enginePrefix}/process-definition/?${query}`)
}

export function processDefinitionsCount(d: Partial<ApiFlowManagement.ProcessDefinitionsQuery>) {
  const query = obj2query(d);
  return request.get<{ count: number }>(`${enginePrefix}/process-definition/count/?${query}`)
}


export function processDefinitionStatistic(processDefinitionId: string, d: Partial<ApiFlowManagement.StatisticQuery>) {
  const query = obj2query(d);
  return request.get<ApiFlowManagement.StatisticsResult[]>(`${enginePrefix}/process-definition/${processDefinitionId}/statistics?${query}`)
}


function obj2query(obj: any) {
  const str: Array<any> = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function cockpitProcessInstance(body: Partial<ApiFlowManagement.CockpitProcessInstanceQuery>, param: Partial<ApiFlowManagement.QueryParam>) {
  const query = obj2query(param);
  return request.post<ApiFlowManagement.CockpitProcessInstance[]>(`${cockpitPrefix}/process-instance?${query}`, body)
}

export function processInstanceCount(body: Partial<ApiFlowManagement.ProcessInstanceCountQuery>) {
  return request.post<{ count: number }>(`${enginePrefix}/process-instance/count`, body)
}


export function processInstance(id: string) {
  return request.get<ApiFlowManagement.ProcessInstance>(`${enginePrefix}/process-instance/${id}`)
}

export function variableInstance(body: Partial<ApiFlowManagement.VariableInstanceQuery>, param: Partial<ApiFlowManagement.QueryParam>) {
  const query = obj2query(param);
  return request.post<ApiFlowManagement.VariableInstance[]>(`${enginePrefix}/variable-instance/?${query}`, body)
}

export function processDefinitionStartForm(id: string) {
  return request.get<ApiFlowManagement.FlowForm>(`${enginePrefix}/process-definition/${id}/startForm`)
}

export function processDefinitionDeployedStartForm(id: string) {
  return request.get<ApiFlowManagement.deployedForm>(`${enginePrefix}/process-definition/${id}/deployed-start-form`)
}

export function processDefinitionSubmitForm(id: string, variables: Record<string, any>) {
  return request.post<ApiFlowManagement.ProcessInstance>(`${enginePrefix}/process-definition/${id}/submit-form`, {variables})
}

export function formDefinitions(param?: Partial<ApiFlowManagement.FormDefinitionQuery>) {
  const query = obj2query(param);
  return request.get<ApiFlowManagement.FormDefinition[]>(`/form-definition?${query}`)
}

export function tasks(param?: Partial<ApiFlowManagement.TaskQuery>) {
  const query = obj2query(param);
  return request.get<ApiFlowManagement.HalTaskList>(`${enginePrefix}/task?${query}`, {headers: HalJsonHeader})
}

export function task(id: string) {
  return request.get<ApiFlowManagement.HalTask>(`${enginePrefix}/task/${id}`, {headers: HalJsonHeader})
}

export function historicTask(param) {
  const query = obj2query(param);
  return request.get<ApiFlowManagement.HalTask>(`${enginePrefix}/history/task?${query}`)
}

export function historicTaskForm(id: string) {
  return request.get<ApiFlowManagement.FlowForm>(`/history/task/${id}/form-data`)
}

export function historicTaskDeployedForm(id: string) {
  return request.get<ApiFlowManagement.deployedForm>(`/history/task/${id}/deployed-form`)
}

export function taskClaim(id: string, userId: string) {
  const body = {userId}
  return request.post<ApiFlowManagement.Task[]>(`${enginePrefix}/task/${id}/claim`, body)
}

export function taskForm(id: string) {
  return request.get<ApiFlowManagement.FlowForm>(`${enginePrefix}/task/${id}/form`)
}

export function taskDeployedForm(id: string) {
  return request.get<ApiFlowManagement.deployedForm>(`${enginePrefix}/task/${id}/deployed-form`)
}

export function taskUnClaim(id: string) {
  return request.post(`${enginePrefix}/task/${id}/unclaim`)
}

export function taskSubmitForm(id: string, variables: Record<string, any>) {
  return request.post(`${enginePrefix}/task/${id}/submit-form`, {variables})
}

export function taskCreateComment(id: string, data: { userId: string, message: string }) {
  return request.post(`${enginePrefix}/task/${id}/comment/create`, data)
}

export function taskComments(id: string) {
  return request.get<ApiFlowManagement.Comment[]>(`${enginePrefix}/task/${id}/comment`)
}

export function taskIdentityLinkDelete(id: string, body: ApiFlowManagement.IdentityLink) {
  return request.post(`${enginePrefix}/task/${id}/identity-links/delete`, body)
}

export function taskIdentityLink(id: string, body: ApiFlowManagement.IdentityLink) {
  return request.post(`${enginePrefix}/task/${id}/identity-links`, body)
}

export function historicActIns(param: Partial<ApiFlowManagement.HistoricActInsQuery>) {
  const query = obj2query(param);
  return request.get<ApiFlowManagement.HistoricActivityInstance[]>(`${enginePrefix}/history/activity-instance?${query}`)
}
