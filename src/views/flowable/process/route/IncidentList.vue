<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    :search="searchQuery"
    :loading="loading"
    :style="'overflow-y: scroll'"
    no-data-text="no more incidents"
  >
    <template #bottom>

    </template>
    <template v-slot:item.id="{ item  : {raw} }">
      <div class="font-weight-bold" @click="">
        {{ raw.id }}
      </div>
    </template>
    <template v-slot:item.action="{item:{raw} }">
      <div class="actions">
        <v-btn flat icon :to="`/flowable/process-definition/${processDefinitionId}/process-instance-detail/${raw.id}`">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>

import {Ref, ref} from "vue";
import {useLoading} from "@/hooks";
import {cockpitProcessInstance} from "@/service";
import {useRouter} from "vue-router";
import {useRouterPush} from "@/composables";

const props = defineProps({
  actId: {
    type: String,
    required: false
  }
})

watch(() => props.actId, async (n, o) => {
  await loadData()
})
const {currentRoute} = useRouter()
const processDefinitionId = currentRoute.value.params['id'] as string
const items = ref<ApiFlowManagement.CockpitProcessInstance[]>([])
const {loading, startLoading, endLoading} = useLoading(true);
const loadData = async () => {
  const activityId = props.actId
  startLoading();
  let activityIdIn
  if (!!activityId)
    activityIdIn = [activityId]
  const data = []
  endLoading();
  if (data) {
    items.value = data
  }
}
const searchQuery = ref('')
const selected = ref<ApiFlowManagement.CockpitProcessInstance[]>([])
const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  {title: 'Id', align: 'start', key: 'id'},
  {title: 'StartTime', align: 'start', key: 'startTime'},
  {title: 'State', align: 'start', key: 'suspended'},
  {title: 'BusinessKey', align: 'start', key: 'businessKey'},
  {title: '', sortable: false, align: 'end', key: 'action'}
])


async function init() {
  await loadData()
}

init()


const {routerPush} = useRouterPush()
</script>

<style scoped>

</style>
