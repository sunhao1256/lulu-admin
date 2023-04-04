<template>
  <v-expansion-panel
    title="User Assignment"
  >
    <v-expansion-panel-text>
      <v-select label="Type" v-model="type" :items="typeOption" density="comfortable" hide-details
                variant="outlined"></v-select>
      <v-select variant="outlined" label="User" density="comfortable" hide-details
                :items="['frank','silva','lulu','xiaowang','xiaosun']"
                v-if="type==='user'"
                @update:modelValue="updateElementUser"
                v-model="userIds"
                chips
                multiple
      ></v-select>
      <v-select variant="outlined" label="Role" density="comfortable" hide-details
                :items="['developer','tester','manager']"
                v-model="roleIds"
                chips
                v-if="type==='role'"
                multiple
      ></v-select>
      <v-text-field
        v-model="dueDate"
        label="DueDate"
        density="comfortable"
        hide-details
        variant="outlined"
        @change="updateElementDueDate"
        type="date"
      ></v-text-field>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";


const typeOption = ['user', 'role']
const type = ref("")
const dueDate = ref<String>("")
const userIds = ref<Array<String>>([])
const roleIds = ref<Array<String>>([])

const modelStore = useModelStore()
const element = modelStore.getActive

const businessObject = getBusinessObject(element);


const getUserIdsValue: () => Array<String> = () => {
  return businessObject.get('camunda:assignee');
};

if (getUserIdsValue()) {
  userIds.value = getUserIdsValue()
  type.value = typeOption[0]
}

const getDueDate: () => String = () => {
  return businessObject.get('camunda:dueDate');
};

if (getDueDate()) {
  dueDate.value = getDueDate()
}

const updateElementUser = (value: Array<String>) => {
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:assignee': value
    }
  });
}
const updateElementDueDate = (value: any) => {
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:dueDate': value.target.value
    }
  });
}
</script>

<style scoped>

</style>
