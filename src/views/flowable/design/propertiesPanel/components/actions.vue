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
                clearable
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
import {addExtensionElements} from "@/views/flowable/utils/BpmnExtensionElementsUtil";
import {
  addExtensionProperty,
  getExtensionProperties,
  removeExtensionProperty
} from "@/views/flowable/bo-utils/extensionPropertiesUtil";

const actionOption = ref(['approve', 'disapprove'])
const actions = ref<Array<String>>([])
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);
const propertyName = "actions"

const tip = usePropertyTip(actions)
const getActions: () => Array<String> = () => {
  const extensions = getExtensionProperties(modelStore.getActive)
  const actions = extensions.find(e => e.name === propertyName)
  if (actions)
    return actions.value?.split(',') || []
  else return []
};

if (getActions()) {
  actions.value = getActions()
}

const updateElementActions = (value: Array<String>) => {
  const extensions = getExtensionProperties(modelStore.getActive)
  const actions = extensions.find(e => e.name === propertyName)
  removeExtensionProperty(modelStore.getActive, actions)
  if (value && value.length > 0)
    addExtensionProperty(modelStore.getActive, {name: propertyName, value: value.join(',')})
}

</script>

<style scoped>

</style>
