import {request} from '../request';
import {cockpitPrefix, enginePrefix} from "@/service";


export function deploymentCreate(d: Partial<ApiFlowManagement.deployCreate>) {
  return request.post(`${enginePrefix}/deployment/create`, {...d}, {
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
  return request.get<ApiFlowManagement.ProcessStatisticsResult[]>(`${enginePrefix}/process-definition/statistics`)
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
  return request.get<ApiFlowManagement.ProcessInstance>(`${enginePrefix}/process-definition/${id}/submit-form`)
}
