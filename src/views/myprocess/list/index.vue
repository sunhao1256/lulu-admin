<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">Forms</div>
        <breadcrumb/>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="text-capitalize" color="primary" to="/my-process/start-process">
        Start Process
      </v-btn>
    </div>

    <v-card>
      <!-- items list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6">
          <v-menu offset-y left>
            <template v-slot:activator="{ props}">
              <v-slide-x-reverse-transition mode="out-in">
                <v-btn v-show="selected.length > 0" v-bind="props">
                  Actions
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </v-slide-x-reverse-transition>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Verify</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Disable</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </v-col>
        <v-col cols="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-inner-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            variant="solo"
            density="comfortable"
            hide-details
            clearable
            placeholder="e.g. filter for name etc"
          ></v-text-field>
          <v-btn
            :loading="loading"
            @click="loadData(req)"
            icon
            flat
            small
            class="ml-2"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-server
        v-model="selected"
        show-select
        :headers="headers"
        :items="items"
        :search="searchQuery"
        :loading="loading"
        :items-length="total"
        v-model:page="page"
        v-model:items-per-page="pageSize"
        v-model:sort-by="sortItem"
        @update:options="options = $event"
        class="flex-grow-1"
      >
        <template v-slot:item.id="{ item  : {raw} }">
          <div class="font-weight-bold">#
            <copy-label :text="raw.id + ''"/>
          </div>
        </template>

        <template v-slot:item.status="{item:{raw}}">
          {{ formStatusLabels [(raw as FormManagement.Form).status] }}
        </template>

        <template v-slot:item.created="{ item  : {raw} }">
          <div>{{ raw.created }}</div>
        </template>

        <template v-slot:item.action="{item:{raw} }">
          <div class="actions">
            <v-btn v-if="!raw.assignee" :loading="claimLoading" flat size="small" variant="tonal" @click="claim(raw)">
              Claim
            </v-btn>
            <v-btn v-else class="ml-1" :loading="unClaimLoading" flat size="small" variant="tonal"
                   @click="unClaim(raw)">
              UnClaim
            </v-btn>
            <v-btn class="ml-1" flat size="small" icon :to="`/my-process/task/${raw.id}/form`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup lang="ts">

import {Ref, ref} from "vue";
import {formStatusLabels} from '@/constants'
import {loadTaskList} from "./helper";
import type {TaskWithPd} from "./helper";
import {useLoading} from "@/hooks";
import {taskClaim, taskUnClaim} from "@/service";


const pageSize = ref(10)
const page = ref(1)
const options = ref()
const searchQuery = ref<string>('')
const sortItem = ref([])
const {loading, loadData, count: total, items} = loadTaskList();
const selected = ref<Array<ApiFlowManagement.FormDefinition>>([])
const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  {title: 'Id', align: 'start', key: 'id', sortable: false},
  {title: 'Name', key: 'name', sortable: false},
  {
    title: 'PdName', key: 'pdName', value: (raw) => {
      const t: TaskWithPd = raw as TaskWithPd
      return t.process?.name || t.process?.key
    }, sortable: false
  },
  {title: 'Created', key: 'created', sortable: false},
  {title: 'Assignee', key: 'assignee', sortable: false},
  {title: 'Owner', key: 'owner', sortable: false},
  {title: 'ProcessDefinition', key: 'processDefinitionId', sortable: false},
  {title: '', sortable: false, align: 'end', key: 'action', width: 200}
])

const req = computed(() => {
  const r: Partial<ApiFlowManagement.TaskQuery> = {
    firstResult: (page.value - 1) * pageSize.value,
    maxResults: pageSize.value,
    sortOrder: 'desc',
    sortBy: 'created',
    active: true
  }
  if (searchQuery.value && searchQuery.value.length > 0) {
    r.nameLike = `${searchQuery.value}%`
  }
  return r
})

async function init() {
  await loadData(req.value)
  watch(options, (n, o) => {
    loadData(req.value)
  }, {deep: true})
}

init()


const {loading: claimLoading} = useLoading()
const claim = async (task: ApiFlowManagement.Task) => {
  claimLoading.value = true
  const {error} = await taskClaim(task.id, 'lulu')
  if (!error) {
    window.$snackBar?.success("claimed successfully")
    await loadData(req.value)
  }
  claimLoading.value = false
}
const {loading: unClaimLoading} = useLoading()
const unClaim = async (task: ApiFlowManagement.Task) => {
  unClaimLoading.value = true
  const {error} = await taskUnClaim(task.id)
  if (!error) {
    window.$snackBar?.success("unClaimed successfully")
    await loadData(req.value)
  }
  unClaimLoading.value = false
}

</script>

<style scoped>

</style>
