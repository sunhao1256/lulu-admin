<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>User Assignment</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
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

      <div class="d-flex flex-row">
        <v-text-field
          v-model="dueDate"
          label="DueDate"
          density="comfortable"
          hide-details
          variant="outlined"
          @change="updateElementDueDateTime"
          type="datetime-local"
        ></v-text-field>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";

const camundaDueDate = "camunda:dueDate"
const typeOption = ['user', 'role']
const type = ref("")
const dueDate = ref<String>("")
const userIds = ref<Array<String>>([])
const roleIds = ref<Array<String>>([])

const modelStore = useModelStore()
const element = modelStore.getActive

const businessObject = getBusinessObject(element);

const tip = usePropertyTip(dueDate, userIds, roleIds)

const getUserIdsValue: () => Array<String> = () => {
  return businessObject.get('camunda:assignee');
};

if (getUserIdsValue()) {
  userIds.value = getUserIdsValue()
  type.value = typeOption[0]
}

const getDueDate: () => String = () => {
  return businessObject.get(camundaDueDate);
};

if (getDueDate()) {
  const arr = getDueDate()
  if (arr.length > 0)
    dueDate.value = arr[0]
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
const updateElementDueDateTime = (value: any) => {
  if (dueDate.value.length <= 0) {
    return
  }
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:dueDate': dueDate.value
    }
  });
}
</script>

<style scoped>

</style>
