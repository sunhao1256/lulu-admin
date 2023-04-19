interface ProcessResult {
  incidents: number,
  runningInstances: number,
  latestId: string,
  name: string,
  processDefinitions: ApiFlowManagement.ProcessDefinition[]
}
