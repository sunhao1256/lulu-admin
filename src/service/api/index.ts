const camundaApiPrefix = '/camunda/api'
export const cockpitPrefix = `${camundaApiPrefix}/cockpit/plugin/base/bpmn`
export const enginePrefix = `${camundaApiPrefix}/engine/engine/bpmn`
export const HalJsonHeader =
  {'Accept': 'application/hal+json,application/json'}

export * from './auth';
export * from './chat';
export * from './flow';
export * from './management';
