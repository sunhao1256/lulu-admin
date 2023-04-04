<template>
  <v-expansion-panel
    title="Opinions"
  >
    <v-expansion-panel-text>
      <v-text-field variant="outlined" label="Condition Express" density="comfortable" hide-details
                    :model-value="conditionExpress" @change="updateElementConditionExpress"></v-text-field>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const conditionExpress = ref<String>("")
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);

const camundaPropertyName = "camunda:conditionExpress"

const getConditionExpress: () => String = () => {
  return businessObject.get(camundaPropertyName);
};

if (getConditionExpress()) {
  conditionExpress.value = getConditionExpress()
}

const updateElementConditionExpress = (value: any) => {
  const properties: Record<string, any> = {}
  properties[camundaPropertyName] = value.target.value
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties,
  });
}

</script>

<style scoped>

</style>
