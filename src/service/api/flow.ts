import {request} from '../request';

const camundaApiPrefix = '/camunda/api'
const cockpitPrefix = `${camundaApiPrefix}/cockpit/plugin/base/bpmn`
const enginePrefix = `${camundaApiPrefix}/engine/engine/bpmn`

export function deploymentCreate(d: ApiFlowManagement.deployCreate) {
  return request.post("/deployment/create", {...d}, {
    headers: {"Content-Type": "multipart/form-data"},
  });
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


export function processDefinitionVersionCount(d: ApiFlowManagement.ProcessDefinitionQueryCount) {
  const query = obj2query(d);
  return request.get(`${enginePrefix}/process-definition/count/?${query}`)
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
