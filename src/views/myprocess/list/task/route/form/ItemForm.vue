<template>
  <div>
    <form-preview v-if="form" :components="form.components" :form="{id:form.id}" read-only></form-preview>
    <div v-else class="d-flex align-center justify-center" style="min-height: 300px">
      <div class="text-h4">Task did not config Form</div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {defineProps, PropType, ref} from 'vue'
import {loadForm} from "@/views/myprocess/list/task/route/form/helper";
import FormPreview from "@/views/form/design/preview";

const props = defineProps({
  variables: {
    type: Array as PropType<ApiFlowManagement.VariableInstance[]>,
  },
  activity: {
    type: Object as PropType<ApiFlowManagement.HistoricActivityInstance>,
    required: true,
  }
})

const {loading, fetch, form} = loadForm(props.activity, props.variables)

const init = async () => {
  await fetch()
}

init()

</script>

<style scoped>

</style>
