declare module "bpmn-js/lib/Modeler"
declare module "bpmn-js-properties-panel"
declare module "camunda-bpmn-moddle/*"
declare module "*.bpmn" {
  const value: any; // Add better type definitions here if desired.
  export default value;
}
