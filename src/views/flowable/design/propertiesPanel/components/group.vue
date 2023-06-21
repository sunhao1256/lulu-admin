<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Group</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-select variant="outlined" label="Group" density="comfortable" hide-details
                clearable
                item-title="name"
                item-value="id"
                :items="groups"
                v-model="group" @update:modelValue="updateElementActions"></v-select>
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
import {processDefinitionGroupList} from "@/service";

const groups = ref<ApiFlowManagement.ProcessDefinitionGroup[]>([])
const group = ref<String>()
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);
const propertyName = "groupId"

const tip = usePropertyTip(group)
const getGroup: () => String = () => {
  const extensions = getExtensionProperties(modelStore.getActive)
  const actions = extensions.find(e => e.name === propertyName)
  if (actions)
    return actions.value?.split(',') || []
  else return []
};

if (getGroup()) {
  group.value = getGroup()
}

const updateElementActions = (value: string) => {
  const extensions = getExtensionProperties(modelStore.getActive)
  const actions = extensions.find(e => e.name === propertyName)
  removeExtensionProperty(modelStore.getActive, actions)
  if (value && value.length > 0)
    addExtensionProperty(modelStore.getActive, {name: propertyName, value})
}


const init = async () => {
  const {data} = await processDefinitionGroupList()
  if (data) {
    groups.value = data
  }
}
init()

</script>

<style scoped>

</style>
