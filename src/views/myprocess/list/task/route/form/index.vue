<template>
  <div class="task-form">
    <v-tabs v-model="tab">
      <v-tab :value="f.id" v-for="f in acts">{{ f.activityName || f.activityId }}</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="f in acts" :value="f.id">
        <item-form :activity="f" :variables="variables"></item-form>
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, PropType, ref} from 'vue'
import {getVariablesByPInstanceId} from "@/views/myprocess/list/task/helper";
import {historicActIns} from "@/service";
import ItemForm from "@/views/myprocess/list/task/route/form/ItemForm.vue";

const tab = ref()
const forms = ref<form[]>([])
const {fetch: fetchVariables, variables} = getVariablesByPInstanceId()
const acts = ref<ApiFlowManagement.HistoricActivityInstance[]>([])


const props = defineProps({
  pId: {
    type: String,
    required: true
  },
  pd: {
    type: Object as PropType<ApiFlowManagement.ProcessDefinition>,
    required: true
  },
})
const init = async () => {
  await fetchVariables(props.pId)
  historicActIns({
    processInstanceId: props.pId,
    sortBy: 'startTime',
    sortOrder: 'asc'
  }).then(({data}) => {
    if (data) {
      acts.value = data.filter(a => !!a.endTime)
      if (acts.value.length > 0) {
        tab.value = acts.value[0].id
      }
    }
  })

}

init()

</script>

<style scoped>
.task-form {
  &:deep(.v-card) {
    box-shadow: none;
  }
}
</style>
