<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Forms</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-select variant="outlined" label="form" density="comfortable" hide-details
                v-model="formRef"
                :items="formOption"
                @update:modelValue="updateElementFormRef"></v-select>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";

const formOption = ref(['ticket_form', 'review_form'])
const formRef = ref<String>("")
const modelStore = useModelStore()
const element = modelStore.getActive
const businessObject = getBusinessObject(element);

const tip = usePropertyTip(formRef)
const getFormRef: () => String = () => {
  return businessObject.get('camunda:formRef');
};

if (getFormRef()) {
  formRef.value = getFormRef()
}

const updateElementFormRef = (value: String) => {
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRef': value
    }
  });
}

</script>

<style scoped>

</style>
