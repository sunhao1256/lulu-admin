<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :style="'overflow-y: scroll'"
    class="inherit-height"
    no-data-text="no more variables"
  >
    <template #bottom>

    </template>
    <template v-slot:item.value="{ item  : {raw} }">
      <variable-value :variable="raw"/>
    </template>
    <template v-slot:item.action="{item:{raw} }">
      <div class="actions">
        <v-btn flat icon size="small">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>

import {PropType, Ref, ref} from "vue";
import VariableValue from "@/views/flowable/process/component/processInstance/variableValue";

const props = defineProps({
  items: {
    type: Object as PropType<Array<ApiFlowManagement.VariableInstance>>,
    required: true,
  }
})
const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  {title: 'Name', align: 'start', key: 'name'},
  {title: 'Type', align: 'start', key: 'type'},
  {title: 'Value', align: 'start', key: 'value'},
  {title: '', sortable: false, align: 'end', key: 'action'}
])

</script>

<style scoped>

</style>
