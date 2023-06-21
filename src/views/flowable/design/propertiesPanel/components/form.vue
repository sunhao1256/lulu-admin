<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Forms</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-text-field density="comfortable" label="form" variant="outlined" readonly="readonly"
                    v-model="formRef"
                    hide-details
                    @click="dialog=true"></v-text-field>
    </v-expansion-panel-text>


    <form-dialog v-model="dialog" @onClick:row="clickrow"></form-dialog>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";
import FormDialog from "@/views/form/dialoglist.vue";

const dialog = ref(false)
const formRef = ref<string>("")
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);
//disable latest
const tip = usePropertyTip(formRef)
const getFormRef: () => string = () => {
  return businessObject.get('camunda:formRef');
};

if (getFormRef()) {
  formRef.value = getFormRef()
}

const updateElementFormRef = async (value?: ApiFlowManagement.FormDefinition) => {
  if (!value)
    return
  defaultLatestBinding()
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRef': value.key
    }
  });
}
const defaultLatestBinding = () => {
  updateElementFormBinding("version")
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
const updateElementFormVersion = (value?: number) => {
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


const clickrow = (form: ApiFlowManagement.FormDefinition) => {
  formRef.value = form.key
  updateElementFormRef(form)
  updateElementFormVersion(form.version)
}
</script>

<style scoped>

</style>
