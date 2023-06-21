<template>
  <v-dialog v-model="dialog" width="700" :persistent="false">
    <v-card>
      <!-- items list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6">
          <div>Choose Form</div>
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
        :headers="headers"
        :items="items"
        :search="searchQuery"
        :loading="loading"
        @click:row="clickrow"
        class="flex-grow-1"
      >
      </v-data-table>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
export default {name: "form-dialog"};
</script>
<script lang="ts" setup>
import {ref, computed} from "vue";
import {loadFormListGroupKey} from "@/views/form/helper";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['onClick:row', 'update:modelValue'])
const dialog = computed({
  set: (val: boolean) => {
    emit("update:modelValue", val)
  },
  get: () => {
    return props.modelValue
  }
})
const {loading, loadData, items} = loadFormListGroupKey();
const options = ref()
const searchQuery = ref<string>('')
const selected = ref<Array<ApiFlowManagement.FormDefinition>>([])
const headers = ref<DataTableHeader>([
  {title: 'Id', align: 'start', key: 'id', sortable: false},
  {title: 'Name', key: 'key', sortable: false},
  {title: 'Version', key: 'version', sortable: false},
  {title: '', sortable: false, align: 'end', key: 'action'}
])

async function init() {
  await loadData()
}

init()

const clickrow = (Event, {item: DataTableItem}) => {
  dialog.value = false
  emit('onClick:row', DataTableItem.raw)
}
</script>

<style scoped>

</style>
