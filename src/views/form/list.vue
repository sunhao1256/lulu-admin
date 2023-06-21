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
          placeholder="e.g. filter for name etc"
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
      class="flex-grow-1"
    >
      <template v-slot:item.id="{ item  : {raw} }">
        <div class="font-weight-bold">#
          <copy-label :text="raw.id + ''"/>
        </div>
      </template>

      <template v-slot:item.action="{item:{raw} }">
        <div class="actions">
          <v-btn flat icon :to="`/form/design/${raw.deploymentId}`">
            <v-icon>mdi-file-edit-outline</v-icon>
          </v-btn>
          <v-btn flat icon :to="`/form/definition/${raw.id}`">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn flat icon @click="deleteForm(raw)">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
export default {name: "form-list"};
</script>
<script lang="ts" setup>
import {ref} from "vue";
import {loadFormListGroupKey} from "@/views/form/helper";

const {loading, loadData, items} = loadFormListGroupKey();
const options = ref()
const searchQuery = ref<string>('')
const selected = ref<Array<ApiFlowManagement.FormDefinition>>([])
const headers = ref<DataTableHeader>([
  {title: 'Id', align: 'start', key: 'id', sortable: false},
  {title: 'Name', key: 'key', sortable: false},
  {title: '', sortable: false, align: 'end', key: 'action'}
])

async function init() {
  await loadData()
}

init()

const deleteForm = async (d: ApiFlowManagement.FormDefinition) => {
  const dialog = window.$dialog?.show({
    main: `Are you sure delete Form ${d.key} ?`,
    confirm: async () => {
      dialog?.confirmLoading(true)
      window.$snackBar?.warning("not support delete form yet")
      dialog?.close()
    }
  })

}

</script>

<style scoped>

</style>
