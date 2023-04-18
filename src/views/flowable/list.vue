<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">Flows</div>
        <breadcrumb/>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="text-capitalize" color="primary">
        Create Flow
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
            placeholder="e.g. filter for id, email, name, etc"
          ></v-text-field>
          <v-btn
            :loading="loading"
            @click="getTableData()"
            icon
            flat
            small
            class="ml-2"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        v-model="selected"
        show-select
        :headers="headers"
        :items="items"
        :search="searchQuery"
        :loading="loading"
        class="flex-grow-1"
      >
        <template #bottom>

        </template>
        <template v-slot:item.id="{ item  : {raw} }">
          <div class="font-weight-bold">#
            <copy-label :text="raw.id + ''"/>
          </div>
        </template>

        <template v-slot:item.status="{item:{raw}}">
          {{ formStatusLabels [(raw as FormManagement.Form ).status] }}
        </template>

        <template v-slot:item.created="{ item  : {raw} }">
          <div>{{ raw.created }}</div>
        </template>

        <template v-slot:item.action="{item:{raw} }">
          <div class="actions">
            <v-btn flat icon :to="`/flowable/design/${raw.processDefinitions[0].id}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn flat icon :to="`/flowable/process-definition/${raw.processDefinitions[0].id}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">

import {Ref, ref} from "vue";
import {useLoading} from '@/hooks';
import {processDefinitionStatistics} from "@/service";
import {groupBy} from 'lodash-es'

const {loading, startLoading, endLoading} = useLoading(true);

interface item {
  incidents: number,
  runningInstances: number,
  name: string,
  processDefinitions: ApiFlowManagement.ProcessDefinition[]
}

const items = ref<item[]>([])
const searchQuery = ref('')
const selected = ref<item[]>([])
const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  {title: 'Name', key: 'name'},
  {title: 'Incidents', align: 'start', key: 'incidents'},
  {title: 'RunningInstances', align: 'start', key: 'runningInstances'},
  {title: '', sortable: false, align: 'end', key: 'action'}
])

async function getTableData() {
  startLoading();
  const {data} = await processDefinitionStatistics();
  endLoading();
  if (data) {
    items.value = uniqueByDefinitionKey(data)
  }
}

async function init() {
  await getTableData()
}

const uniqueByDefinitionKey = (list: ApiFlowManagement.ProcessStatisticsResult[]): item[] => {
  const groups = groupBy(list, (i: ApiFlowManagement.ProcessStatisticsResult) => i.definition.key)
  return Object.keys(groups)
    .map(key => {
      const list = groups[key]
      const incidents = list.reduce((accumulate: number, current: ApiFlowManagement.ProcessStatisticsResult) => {
        return accumulate + current.incidents.length
      }, 0)
      const runningInstances = list.reduce((accumulate: number, current: ApiFlowManagement.ProcessStatisticsResult) => {
        return accumulate + current.instances
      }, 0)
      const processDefinitions = list.map(i => i.definition);
      processDefinitions.sort((p, a) => a.version - p.version)
      return {
        name: processDefinitions[0].name || processDefinitions[0].key,
        incidents,
        runningInstances,
        processDefinitions,
      }
    })
}

init()

</script>

<style scoped>

</style>
