export const createNewDiagram = async function (newXml?: string, settings?: any) {
  try {
    const store = useModelStore()
    const timestamp = Date.now()
    const {processId, processName, processEngine} = settings || {}
    const newId: string = processId ? processId : `Process_${timestamp}`
    const newName: string = processName || `Process_${timestamp}`
    const xmlString = newXml || emptyXML(newId, newName, processEngine)
    const modeler = store.getModeler
    const {warnings} = await modeler!.importXML(xmlString)
    if (warnings && warnings.length) {
      warnings.forEach((warn: any) => console.warn(warn))
    }
  } catch (e) {
    console.error(`[Process Designer Warn]: ${typeof e === 'string' ? e : (e as Error)?.message}`)
  }
}

const emptyXML = (key: string, name: string, type?: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  targetNamespace="http://bpmn.io/schema/bpmn"
  id="Definitions_${key}">
  <bpmn:process id="${key}" name="${name}" isExecutable="true"></bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}"></bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
}
