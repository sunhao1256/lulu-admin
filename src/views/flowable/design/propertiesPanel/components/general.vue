<template>

  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>General</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-text-field variant="outlined" label="name" density="comfortable" hide-details
                    v-model="elementName" @change="updateElementName"></v-text-field>
      <v-text-field variant="outlined" label="id" density="comfortable" hide-details
                    readonly
                    :model-value="elementId" @change="updateElementId"></v-text-field>
      <template v-if="isProcess">
        <v-text-field variant="outlined" label="versionTag" density="comfortable" hide-details
                      v-model="elementVersion" @change="updateElementVersion"></v-text-field>
        <v-checkbox label="executable" hide-details density="comfortable"
                    v-model="elementExecutable" @change="setProcessExecutable"></v-checkbox>
      </template>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getNameValue, setNameValue} from "@/views/flowable/bo-utils/nameUtil";
import {
  getProcessVersionTag,
  setProcessVersionTag
} from "@/views/flowable/bo-utils/processUtil";
import EventEmitter from "@/utils/flow/EventEmitter";
import {setIdValue} from "@/views/flowable/bo-utils/idUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const isProcess = ref<Boolean>(false)
const elementName = ref<String>("")
const elementId = ref<String>("")
const elementExecutable = ref<Boolean>(true)
const elementVersion = ref<String>("")
const tip = usePropertyTip(elementName, elementExecutable)
const modelStore = useModelStore()

const reloadGenerationData = () => {
  isProcess.value = !!modelStore.getActive && modelStore.getActive.type === 'bpmn:Process'
  elementId.value = modelStore.getActiveId as string
  elementName.value = getNameValue(modelStore.getActive) || ''
  if (isProcess.value) {
    elementExecutable.value = getProcessExecutable()
    elementVersion.value = getProcessVersionTag(modelStore.getActive) || ''
  }
}

const updateElementName = (value: any) => {
  setNameValue(modelStore.getActive, value.target.value)
}
const updateElementId = (value: any) => {
  setIdValue(modelStore.getActive, value.target.value)
}
const updateElementVersion = (value: any) => {
  const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/
  if (reg.test(value.target.value)) {
    setProcessVersionTag(modelStore.getActive, value.target.value)
  } else {
    window.$snackBar?.error('版本号必须符合语义化版本2.0.0 要点')
  }
}

onMounted(() => {
  reloadGenerationData()
  EventEmitter.on('element-update', reloadGenerationData)
})


const element = modelStore.getActive
const businessObject = getBusinessObject(element);
const getProcessExecutable = () => {
  return businessObject.isExecutable;
}

const setProcessExecutable = () => {
  const store = useModelStore()
  const modeling = store.getModeling

  modeling.updateProperties(element, {
    isExecutable: elementExecutable.value
  })
}


</script>

<style scoped>

</style>
