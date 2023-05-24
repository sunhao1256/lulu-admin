<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Forms</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-autocomplete
        v-model="formRef"
        :loading="loading"
        v-model:search="formSearch"
        variant="outlined"
        :items="items"
        density="comfortable"
        hide-details
        item-title="key"
        return-object
        clearable
        hide-no-data
        label="form"
        @update:modelValue="updateElementFormRef"
      >
      </v-autocomplete>
      <v-select
        variant="outlined"
        density="comfortable"
        hide-details
        label="binding" v-model="binding" :items="bindingOptions"
        @update:modelValue="updateElementFormBinding"
      ></v-select>
      <v-select
        variant="outlined"
        v-if="binding==='version'"
        density="comfortable"
        hide-details
        item-title="version"
        item-value="version"
        label="version" v-model="version" :items="versionOptions"
        @update:modelValue="updateElementFormVersion"
      ></v-select>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";
import {loadFormList, loadFormListGroupKey} from "@/views/form/helper";

const formRef = ref<string>("")
const formRefVersion = ref<string>("")
const formSearch = ref<string>("")
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);
//disable latest
const binding = ref<string>("version")
const version = ref<string>("")
const bindingOptions = ref<Array<string>>(['version'])
const tip = usePropertyTip(formRef)
const getFormRef: () => string = () => {
  return businessObject.get('camunda:formRef');
};

const {loadData: loadVersionData, items: versionOptions} = loadFormList()
const getVersionData = async (key: string) => {
  await loadVersionData({
    sortBy: "version",
    key
  })
}
if (getFormRef()) {
  formRef.value = getFormRef()
  getVersionData(formRef.value).then()
}

const getFormRefBinding: () => string = () => {
  return businessObject.get('camunda:formRefBinding');
};

if (getFormRefBinding()) {
  binding.value = getFormRefBinding()
}
const getFormRefVersion: () => string = () => {
  return businessObject.get('camunda:formRefVersion');
};

if (getFormRefVersion()) {
  version.value = getFormRefVersion()
}

const {loading, loadData, items} = loadFormListGroupKey()
const getTableData = async () => {
  await loadData()
}
getTableData()


const updateElementFormRef = async (value?: ApiFlowManagement.FormDefinition) => {
  if (!value)
    return
  defaultLatestBinding()
  getVersionData(value.key).then()
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRef': value.key
    }
  });
}
const defaultLatestBinding = () => {
  binding.value = bindingOptions.value[0]
  updateElementFormBinding(binding.value)
}
const updateElementFormBinding = (value?: string) => {
  if (!value)
    return
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRefBinding': value
    }
  });
}
const updateElementFormVersion = (value?: string) => {
  if (!value)
    return
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRefVersion': value
    }
  });
}

</script>

<style scoped>

</style>
