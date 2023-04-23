<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Condition</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-textarea variant="outlined" label="expression" density="comfortable" hide-details
                  v-model="expressionRef"
                  @change="updateElementCondition"></v-textarea>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject, is} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";
import {getEventDefinition} from "@/views/flowable/utils/BpmnImplementationType";
import {createModdleElement} from "@/views/flowable/utils/BpmnExtensionElementsUtil";

const expressionRef = ref()
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);

const bpmnFactory = modelStore.getModeler.get('bpmnFactory')

const tip = usePropertyTip(expressionRef)
const getFormRef = () => {
  return getConditionExpression(element)?.get('body')
};

if (getFormRef()) {
  expressionRef.value = getFormRef()
}

const updateElementCondition = (value: any) => {

  //only support expression
  updateConditionType("expression")

  const conditionExpression = createFormalExpression(
    element,
    {
      body: value.target.value
    },
    bpmnFactory
  );
  console.log(conditionExpression)

  const commandStack = modelStore.getCommandStack
  updateCondition(element, commandStack, conditionExpression);

}

const updateConditionType = (value) => {
  // (1) Remove formalExpression if <none> is selected
  console.log(value)
  const commandStack = modelStore.getCommandStack
  console.log(bpmnFactory)
  if (value === '') {
    updateCondition(element, commandStack, undefined);
  } else {
    // (2) Create and set formalExpression element containing the conditionExpression
    const attributes = {
      body: '',
      language: value === 'script' ? '' : undefined,
    };
    const formalExpressionElement = createFormalExpression(element, attributes, bpmnFactory);

    updateCondition(element, commandStack, formalExpressionElement);
  }
}


const updateCondition = (element, commandStack, condition: any = undefined) => {
  if (is(element, 'bpmn:SequenceFlow')) {
    commandStack.execute('element.updateProperties', {
      element,
      properties: {
        conditionExpression: condition
      }
    });
  } else {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: getConditionalEventDefinition(element),
      properties: {
        condition
      }
    });
  }
}

const createFormalExpression = (parent, attributes, bpmnFactory) => {
  return createModdleElement(
    'bpmn:FormalExpression',
    attributes,
    is(parent, 'bpmn:SequenceFlow') ? getBusinessObject(parent) : getConditionalEventDefinition(parent),
  );
}

const getConditionalEventDefinition = (element) => {
  if (!is(element, 'bpmn:Event')) {
    return false;
  }

  return getEventDefinition(element, 'bpmn:ConditionalEventDefinition');
}

function getConditionExpression(element) {
  const businessObject = getBusinessObject(element);

  if (is(businessObject, 'bpmn:SequenceFlow')) {
    return businessObject.get('conditionExpression');
  } else if (getConditionalEventDefinition(businessObject)) {
    return getConditionalEventDefinition(businessObject).get('condition');
  }
}


</script>

<style scoped>

</style>
