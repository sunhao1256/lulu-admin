<template>
  <v-data-table
    v-model="selected"
    show-select
    :headers="headers"
    :items="items"
    :search="searchQuery"
    :loading="loading"
    :style="'overflow-y: scroll'"
    no-data-text="no more process"
  >
    <template #bottom>

    </template>
    <template v-slot:item.id="{ item  : {raw} }">
      <div class="font-weight-bold">#
        <copy-label :text="raw.id + ''"/>
      </div>
    </template>

    <template v-slot:item.startTime="{item:{raw}}">
      {{ raw.startTime }}
    </template>

    <template v-slot:item.businessKey="{item:{raw}}">
      {{ raw.businessKey }}
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>

import {Ref, ref} from "vue";
import {useLoading} from "@/hooks";
import {cockpitProcessInstance} from "@/service";
import {useRouter} from "vue-router";

const {currentRoute} = useRouter()
const processDefinitionId = currentRoute.value.params['id'] as string
const items = ref<ApiFlowManagement.CockpitProcessInstance[]>([])
const {loading, startLoading, endLoading} = useLoading(true);
const loadData = async () => {
  startLoading();
  const {data} = await cockpitProcessInstance({
    processDefinitionId,
    sortBy: 'startTime',
    sortOrder: 'desc'
  }, {
    firstResult: 0,
    maxResults: 50,
  });
  endLoading();
  if (data) {
    items.value = data
  }
}
const searchQuery = ref('')
const selected = ref<ProcessResult[]>([])
const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  {title: 'Id', align: 'start', key: 'id'},
  {title: 'StartTime', align: 'start', key: 'startTime'},
  {title: 'BusinessKey', align: 'start', key: 'businessKey'},
  {title: '', sortable: false, align: 'end', key: 'action'}
])

async function init() {
  await loadData()
}

init()
</script>

<style scoped>

</style>
