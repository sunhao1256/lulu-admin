import {ModdleElement} from 'bpmn-moddle'
import {useModelStore} from '@/store'


/////////////
export function createModdleElement(
  elementType: string,
  properties: Record<string, any>,
  parent?: any
): ModdleElement {
  const moddle = useModelStore().getModdle
  const element = moddle.create(elementType, properties)
  parent && (element.$parent = parent)
  return element
}
