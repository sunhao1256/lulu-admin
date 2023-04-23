import {find} from 'min-dash'
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'
import {Base} from 'diagram-js/lib/model'
import {ModdleElement} from 'bpmn-moddle'

// 获取节点事件定义
export function getEventDefinition(
  element: Base | ModdleElement,
  eventType: string
): ModdleElement | undefined {
  const businessObject = getBusinessObject(element)
  const eventDefinitions = businessObject.get('eventDefinitions') || []
  return find(eventDefinitions, function (definition) {
    return is(definition, eventType)
  })
}
