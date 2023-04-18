import {request} from '../request';

export function deploymentCreate(d: ApiFlowManagement.deployCreate) {
  return request.post("/deployment/create", {...d}, {
    headers: {"Content-Type": "multipart/form-data"},
  });
}

export function processDefinitionStatistics() {
  return request.get<ApiFlowManagement.ProcessStatisticsResult[]>("/process-definition/statistics")
}

export function processDefinitionXml(processDefinitionId: string) {
  return request.get<ApiFlowManagement.ProcessDefinitionXmlResult>(`/process-definition/${processDefinitionId}/xml`)
}
