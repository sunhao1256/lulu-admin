<template>
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
          @click="loadData()"
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
      no-data-text="no more process"
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
          <v-btn flat icon :to="`/flowable/design/${raw.processDefinitionId}`">
            <v-icon>mdi-file-edit-outline</v-icon>
          </v-btn>
          <v-btn flat icon :to="`/flowable/process-definition/${raw.processDefinitionId}/process-instance`">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>

import {Ref, ref} from "vue";
import {loadGroupProcessDefinitionList, loadListProcessResultStatistics} from "@/views/flowable/process/helper";
import {formStatusLabels} from "@/constants";
import {useRouter} from "vue-router";

const {currentRoute} = useRouter()
const groupId = ref(currentRoute.value.params['gId'] as string)
const {loading, loadData, items} = loadGroupProcessDefinitionList(groupId.value)
const searchQuery = ref('')
const selected = ref<ProcessResult[]>([])
const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  {title: 'Id', key: 'processDefinitionId'},
  {title: 'Key', key: 'processDefinitionKey'},
  {title: 'Name', key: 'processDefinitionName'},
  {title: 'Creator', key: 'createBy'},
  {title: 'DeployedTime', align: 'start', key: 'deployedTime'},
  {title: '', sortable: false, align: 'end', key: 'action'}
])

async function init() {
  console.log('xx')
  await loadData()
}

init()
</script>

<style scoped>

</style>
