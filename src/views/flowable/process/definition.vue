<template>
  <div class="d-flex flex-column flex-grow-1 h-100">
    <v-layout>
      <v-navigation-drawer permanent color="background">
        <v-list>
          <v-list-item v-for="v in left">
            <v-list-item-title>{{ v.title }}</v-list-item-title>
            <copy-label :text="pd[v.key]"/>
          </v-list-item>
          <v-list-item title="Instances Running" class="running">
            <div>
              <span class="key">current version</span>
              <span class="font-weight-bold">0</span>
            </div>
            <div>
              <span class="key">all versions</span>
              <span class="font-weight-bold">0</span>
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
            <v-tabs :show-arrows="false" background-color="transparent" color="primary" class="overflow-visible">
              <v-tab :to="`/flowable/process-definition/${processDefinitionId}/process-instance`">Process
                Instance
              </v-tab>
              <v-tab :to="`/flowable/process-definition/${processDefinitionId}/incident`">Incidents</v-tab>
            </v-tabs>
            <v-window class="h-100">
              <router-view v-slot="{ Component }">
                <v-fade-transition mode="out-in">
                  <component :is="Component"/>
                </v-fade-transition>
              </router-view>
            </v-window>
          </div>
        </v-footer>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {
  processDefinition,
  processDefinitionStatistic,
  processDefinitionVersionCount,
  processDefinitionXml
} from "@/service";
import {ref} from 'vue'
import Viewer from "bpmn-js/lib/NavigatedViewer";
import {fitAuto, setupEventListener} from './helper'
import Navigate from "@/views/flowable/components/navigate.vue";

const {currentRoute} = useRouter()
const processDefinitionId = currentRoute.value.params['id'] as string
const pd = ref<Partial<ApiFlowManagement.ProcessDefinition>>({})
const vCount = ref()
const viewerRef = ref<HTMLDivElement | null>(null)
const xml = ref()
const statistics = ref<ApiFlowManagement.StatisticsResult[]>()
const selection = ref<string[]>([])

const init = async () => {
  const resp = await processDefinition(processDefinitionId)
  if (!resp.data) {
    return
  }
  pd.value = resp.data

  const cResp = await processDefinitionVersionCount({
    key: pd.value.key || "",
    withoutTenantId: true,
    sortBy: 'version',
    sortOrder: 'desc'
  })
  if (!cResp.data) {
    return
  }
  vCount.value = cResp.data['count']

  const xmlResp = await processDefinitionXml(processDefinitionId)
  if (!xmlResp.data) {
    return
  }
  xml.value = xmlResp.data.bpmn20Xml

  //statistic
  const statisticResp = await processDefinitionStatistic(processDefinitionId, {
    incidents: true
  })
  if (!statisticResp.data) {
    return
  }
  statistics.value = statisticResp.data
}

const viewer = ref()
onMounted(async () => {
  try {
    await init()
    const viewerOptions = {
      container: viewerRef.value,
    }
    await nextTick()
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
    setupEventListener(viewer.value, statistics.value, selection.value, (id) => {
      if (id) {
        console.log(id)
      }
    })

  } catch (e) {
    console.log(e)
  }
})

const left = ref<Array<{ title: string, key: string }>>([
  {
    title: 'Definition Version',
    key: 'version',
  },
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
