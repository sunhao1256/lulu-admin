<template>

  <v-dialog v-model="show" max-width="700" :persistent="true">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        {{ substance }}
        <v-checkbox label="Include Instances" v-model="includeInstances">
        </v-checkbox>
        <v-radio-group label="Execute" v-model="execute">
          <v-radio label="Immediately" :value="1"></v-radio>
          <v-radio label="Delayed" :value="2"></v-radio>
        </v-radio-group>
        <div class="d-flex" v-if="execute==2">
          <v-text-field variant="outlined" style="max-width: 200px" density="comfortable" class="ml-1"
                        v-model="scheduleTime"
                        type="datetime-local"></v-text-field>
        </div>
        <div>
          {{ confirmTips }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="cancel"> cancel</v-btn>
        <v-btn color="error" variant="tonal" @click="confirm">{{ btnText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">


import {useLoading} from "@/hooks";
import {processDefinitionSuspended} from "@/service";
import {useRouter} from "vue-router";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  suspended: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const includeInstances = ref(true)
const execute = ref(1)
const scheduleTime = ref<string>()

const emit = defineEmits(['update:show', 'confirm'])
const cancel = () => {
  includeInstances.value = true
  execute.value = 1
  scheduleTime.value = undefined
  emit('update:show', !show)
}


const {loading, startLoading, endLoading} = useLoading()
const confirm = async () => {
  const req: Partial<ApiFlowManagement.ProcessDefinitionSuspendedParam> = {
    suspended: !props.suspended,
    includeProcessInstances: includeInstances.value,
  }
  if (scheduleTime.value && scheduleTime.value.length > 0) {
    req.executionDate = scheduleTime.value
  }

  startLoading()
  await processDefinitionSuspended(props.id, req)
  endLoading()
  emit('update:show', !show)
  emit('confirm')


}
const {show} = toRefs(props)
const title = computed(() => {
  if (props.suspended) {
    return 'Activate Process Definition'
  } else {
    return `Suspend Process Definition`
  }
})
const substance = computed(() => {
  if (props.suspended) {
    return 'This process definition will be activated, so that it will be possible to start new process instances based on this process definition.'
  } else {
    return `This process definition will be activated, so that it will be possible to start new process instances based on this process definition.`
  }
})
const btnText = computed(() => {
  if (props.suspended) {
    return 'Activate'
  } else {
    return `Suspend`
  }
})
const confirmTips = computed(() => {
  if (props.suspended) {
    return 'Do you really want to activate this process definition?'
  } else {
    return `Do you really want to suspend this process definition?`
  }
})

</script>

<style scoped>

</style>
