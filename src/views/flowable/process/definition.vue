<template>
  <div class="d-flex flex-column flex-grow-1 h-100">
    <v-layout>
      <v-navigation-drawer permanent color="background">
        <v-list>
          <v-list-item>
            <v-list-item-title>Definition Version</v-list-item-title>
            <v-select :items="pds" :item-value="(e)=>e" @update:modelValue="switchVersion" v-model="pd"
                      item-title="version" density="comfortable"
                      hide-details
                      variant="outlined"
            ></v-select>
          </v-list-item>
          <v-list-item v-for="v in left">
            <v-list-item-title>{{ v.title }}</v-list-item-title>
            <copy-label v-if="pd[v.key]" :text="pd[v.key]"/>
            <span v-else>null</span>
          </v-list-item>
          <v-list-item title="Instances Running" class="running">
            <div>
              <span class="key">current version</span>
              <span class="font-weight-bold">{{ currentVersionRunningInstance }}</span>
            </div>
            <div>
              <span class="key">all versions</span>
              <span class="font-weight-bold">{{ allVersionRunningInstance }}</span>
            </div>
          </v-list-item>
          <v-list-item title="Suspended">
            <div class="my-1">
              <div class="d-flex">
                {{ pd.suspended }}
                <v-spacer/>
                <v-btn size="small" color="primary" density="comfortable" icon @click="suspend">
                  <v-icon size="small" v-if="!!pd.suspended">mdi-play</v-icon>
                  <v-icon size="small" v-else>mdi-pause</v-icon>
                </v-btn>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <div class='h-100 w-100 viewer position-relative' ref=viewerRef>
          <navigate v-if="!!viewer" :viewer="viewer"/>
        </div>
        <v-footer app height="300" class="pa-0">
          <div class="d-flex flex-column w-100 h-100">
            <div class="d-flex justify-space-between align-center">
              <v-tabs :show-arrows="false" background-color="transparent" color="primary" class="overflow-visible">
                <v-tab :to="`/flowable/process-definition/${processDefinitionId}/process-instance`">Process
                  Instance
                </v-tab>
                <v-tab :to="`/flowable/process-definition/${processDefinitionId}/incident`">Incidents</v-tab>
              </v-tabs>


              <v-chip-group
                column
                @update:modelValue="setupElementEvent"
                multiple
              >
                <v-slide-x-reverse-transition>
                  <v-chip
                    v-for="(v,i) in selection"
                    closable
                    :key="i"
                    variant="outlined"
                  >
                    {{ 'Activity' + "=" + v }}
                  </v-chip>
                </v-slide-x-reverse-transition>
              </v-chip-group>
            </div>
            <v-window class="h-100">
              <router-view :key="processDefinitionId+pd.suspended" v-slot="{ Component }">
                <v-fade-transition mode="out-in">
                  <component :is="Component" :actId="selectActId"/>
                </v-fade-transition>
              </router-view>
            </v-window>
          </div>
        </v-footer>
      </v-main>
    </v-layout>

    <suspenddialog :suspended="!!pd.suspended" :id="processDefinitionId"
                   @confirm="watchToggle"
                   v-model:show="suspendDialogShow"></suspenddialog>

  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {
  processDefinition, processDefinitions,
  processDefinitionStatistic,
  processDefinitionsCount,
  processDefinitionXml, processInstanceCount
} from "@/service";
import {ref, watch} from 'vue'
import Viewer from "bpmn-js/lib/NavigatedViewer";
import {fitAuto, setupEventListener} from './helper'
import Navigate from "@/views/flowable/components/navigate.vue";

const {currentRoute} = useRouter()
const processDefinitionId = ref(currentRoute.value.params['pId'] as string)
const pd = ref<Partial<ApiFlowManagement.ProcessDefinition>>({})
const vCount = ref()
const viewerRef = ref<HTMLDivElement | null>(null)
const xml = ref()
const statistics = ref<ApiFlowManagement.StatisticsResult[]>()
const pds = ref<ApiFlowManagement.ProcessDefinition[]>([])
const selection = ref<string[]>([])
const allVersionRunningInstance = ref<number>(0)
const currentVersionRunningInstance = ref<number>(0)
const watchToggle = async () => {
  if (!processDefinitionId.value)
    return
  const xmlResp = await processDefinitionXml(processDefinitionId.value)
  if (!xmlResp.data) {
    return
  }
  xml.value = xmlResp.data.bpmn20Xml

  //statistic
  const statisticResp = await processDefinitionStatistic(processDefinitionId.value, {
    incidents: true
  })
  if (!statisticResp.data) {
    return
  }
  statistics.value = statisticResp.data
  //current version count
  const cpicResp = await processInstanceCount({
    processDefinitionId: processDefinitionId.value,
  })
  if (!cpicResp.data) {
    return
  }
  currentVersionRunningInstance.value = cpicResp.data.count

  await render()
}
const init = async () => {
  const resp = await processDefinition(processDefinitionId.value)
  if (!resp.data) {
    return
  }
  pd.value = resp.data

  const cResp = await processDefinitionsCount({
    key: pd.value.key,
    withoutTenantId: true,
    sortBy: 'version',
    sortOrder: 'desc'
  })
  if (!cResp.data) {
    return
  }
  vCount.value = cResp.data.count


  const pdsResp = await processDefinitions({
    key: pd.value.key,
    withoutTenantId: true,
    sortBy: 'version',
    sortOrder: 'desc'
  })
  if (!pdsResp.data) {
    return
  }
  pds.value = pdsResp.data


  //all version count
  const picResp = await processInstanceCount({
    processDefinitionKey: pd.value.key,
    processDefinitionWithoutTenantId: true
  })
  if (!picResp.data) {
    return
  }
  allVersionRunningInstance.value = picResp.data.count
}
const route = useRoute()
const useParams = computed(() => route.params['pId'])
watch(useParams, (r, o) => {
  if (!r)
    return
  processDefinitionId.value = r as string
  watchToggle()
}, {immediate: true})


const router = useRouter()
const switchVersion = (pd: ApiFlowManagement.ProcessDefinition) => {
  if (pd && pd.id)
    router.replace({path: `/flowable/process-definition/${pd.id}/process-instance`})
}

const render = async () => {
  try {
    await init()
    const viewerOptions = {
      container: viewerRef.value,
    }
    await nextTick()
    const firstCreate = !viewer.value
    if (firstCreate)
      viewer.value = new Viewer(viewerOptions)
    try {
      const {warnings} = await viewer.value!.importXML(xml.value)
      if (warnings && warnings.length) {
        warnings.forEach((warn: any) => console.warn(warn))
      }
    } catch (e) {
      console.error(`[Process Viewer Warn]: ${typeof e === 'string' ? e : (e as Error)?.message}`)
    }
    fitAuto(viewer.value)
    setupElementEvent()

  } catch (e) {
    console.log(e)
  }
}


const setupElementEvent = () => {
  setupEventListener(viewer.value, statistics.value, selection.value, (id) => {
  })
}

watch(selection, (n: string[]) => {
  selectActId.value = n[0]
}, {deep: true})


import Suspenddialog from "@/views/flowable/process/component/suspenddialog.vue";

const suspendDialogShow = ref(false)

const suspend = () => {
  suspendDialogShow.value = true
}

const selectActId = ref<string | null>()
const viewer = ref()
const left = ref<Array<{ title: string, key: string }>>([
  {
    title: 'Version Tag',
    key: 'versionTag'
  },
  {
    title: 'Definition ID',
    key: 'id'
  },
  {
    title: 'Definition Key',
    key: 'key'
  },
  {
    title: 'Definition Name',
    key: 'name'
  },
  {
    title: 'History Time To Live',
    key: 'historyTimeToLive'
  },
  {
    title: 'Tenant ID',
    key: 'tenantId'
  },
  {
    title: 'Deployment ID',
    key: 'deploymentId'
  },
])

</script>

<style scoped lang="scss">

.viewer {
  cursor: grab;
}

.running {
  &:deep(.key::after) {
    content: ':';
  }
}

:deep(.badge) {
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  color: rgba(var(--v-theme-primary-darken3));
}
</style>
