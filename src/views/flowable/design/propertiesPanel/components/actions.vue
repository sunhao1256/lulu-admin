<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Actions</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-select variant="outlined" label="Action" density="comfortable" hide-details
                multiple
                :items="actionOption"
                v-model="actions" @update:modelValue="updateElementActions"></v-select>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";

const actionOption = ref(['approve', 'disapprove'])
const actions = ref<Array<String>>([])
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);

const camundaPropertyName = "camunda:userActions"

const tip = usePropertyTip(actions)
const getActions: () => Array<String> = () => {
  return businessObject.get(camundaPropertyName);
};

if (getActions()) {
  actions.value = getActions()
}

const updateElementActions = (value: Array<String>) => {
  const properties: Record<string, any> = {}
  properties[camundaPropertyName] = value
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties,
  });
}

</script>

<style scoped>

</style>
