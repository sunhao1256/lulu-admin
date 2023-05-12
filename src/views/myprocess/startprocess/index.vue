<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">{{ t('menu.my-process-start-process') }}</div>
        <breadcrumb/>
      </div>
      <v-spacer/>
      <v-text-field
        append-inner-icon="mdi-magnify"
        style="max-width: 250px"
        v-model="search"
        placeholder="filtered by name etc" hide-details/>
    </div>

    <div>
      <v-row>
        <v-col sm="6" md="4" lg="3" v-for="p in processDefinitionList">
          <v-card min-height="200" class="d-flex flex-column">
            <v-card-title>
              <div class="text-truncate">{{ p.name || p.key }}</div>
              <v-spacer/>
              <v-chip size="small">
                {{ 'v' + p.version }}
              </v-chip>
            </v-card-title>
            <v-card-subtitle>{{ p.id }}</v-card-subtitle>
            <v-card-text>
              <div>
                {{ p.description }}
              </div>
            </v-card-text>
            <v-spacer/>
            <v-card-actions class="mt-auto">
              <v-btn variant="tonal" color="primary"
                     :to="`/my-process/start-process/${p.id}/start`"
                     append-icon="mdi-open-in-new">Apply
              </v-btn>
              <v-btn @click="review(p)">Review Process</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination :length="pageLength" class="mt-2" v-model="page"></v-pagination>
    </div>
    <v-dialog max-width="900" v-model="reviewModel">
      <v-card height="600">
        <v-card-title>{{ reviewPd.name || reviewPd.key }}
          <v-spacer/>
          <v-btn icon variant="flat" @click="reviewModel=!reviewModel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <viewer v-if="reviewPd.id" :process-definition-id="reviewPd.id"/>
      </v-card>
    </v-dialog>
  </div>


</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {processDefinitions, processDefinitionsCount} from "@/service";
import {ref} from 'vue'
import {useLoadingProgressLine} from "@/components/provider";
import {debounce} from "lodash-es";
import Viewer from "@/views/flowable/components/viewer";

const {t} = useI18n()

const processDefinitionList = ref<ApiFlowManagement.ProcessDefinition[]>([])

const total = ref()
const {show, hide} = useLoadingProgressLine()
const pageLength = ref()
const pageSize = 12
const page = ref(1)
const search = ref('')
const reviewModel = ref(false)
const reviewPd = ref<Partial<ApiFlowManagement.ProcessDefinition>>({})
const getPd = async () => {
  const req: Partial<ApiFlowManagement.ProcessDefinitionsQuery> =
    {
      latest: true,
      active: true,
      startableInTasklist: true,
      startablePermissionCheck: true,
      firstResult: (page.value - 1) * pageSize,
      maxResults: pageSize
    }

  if (search.value && search.value.length > 0) {
    req.nameLike = `%${search.value}%`
  }
  show()
  const {data: countData} = await processDefinitionsCount(req)
  if (countData) {
    total.value = countData.count
    pageLength.value = Math.ceil(total.value / pageSize)
  }
  const {data} = await processDefinitions(req)
  if (data) {
    processDefinitionList.value = data
  }
  hide()
}

const review = (p: ApiFlowManagement.ProcessDefinition) => {
  reviewPd.value = p
  reviewModel.value = true
}

watch(page, () => {
  getPd()
})

watch(search, () => {
  debounceGetPd()
})

const debounceGetPd = debounce(getPd, 200)


getPd()

</script>

<style scoped>

</style>
