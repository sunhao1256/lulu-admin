<template>
  <div class="d-flex flex-column flex-grow-1 h-100">
    <v-layout>
      <v-navigation-drawer permanent color="background">
        <v-list>
          <v-list-item v-for="v in left">
            <v-list-item-title>{{ v.title }}</v-list-item-title>
            <copy-label v-if="v.pd?pd[v.key]:pi[v.key]" :text="v.pd?pd[v.key]:pi[v.key]"/>
            <span v-else>null</span>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <div class='h-100 w-100 viewer position-relative' ref=viewerRef>

        </div>
        <v-footer app height="300" class="pa-0">
          <div class="d-flex flex-column w-100 h-100">
            <div class="d-flex justify-space-between align-center">
              <v-tabs v-model="tab" :show-arrows="false" background-color="transparent" color="primary"
                      class="overflow-visible">
                <v-tab value="variable">Variables
                </v-tab>
                <v-tab value="userTasks">UserTasks</v-tab>
              </v-tabs>

            </div>
            <v-window class="h-100" v-model="tab">
              <v-window-item value="variable" class="inherit-height">
                <variable-list :items="variables"/>
              </v-window-item>
              <v-window-item value="userTasks" class="inherit-height">
                userTasks
              </v-window-item>
            </v-window>
          </div>
        </v-footer>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {processDefinition, processInstance, variableInstance} from '@/service'
import {useRouter} from "vue-router";
import {tr} from "vuetify/locale";
import VariableList from "@/views/flowable/process/component/processInstance/variableList.vue";

const tab = ref()
const pi = ref<Partial<ApiFlowManagement.ProcessInstance>>({})
const pd = ref<Partial<ApiFlowManagement.ProcessDefinition>>({})
const variables = ref<Array<ApiFlowManagement.VariableInstance>>([])
const sorting = ref<Array<ApiFlowManagement.Sorting>>([{sortBy: 'variableName', sortOrder: 'asc'}])
const viewer = ref()

const {currentRoute} = useRouter()
const processInstanceId = ref(currentRoute.value.params['insId'] as string)
const loadData = async () => {
  const resp = await processInstance(processInstanceId.value)
  if (!resp.data)
    return
  pi.value = resp.data
  const pdResp = await processDefinition(resp.data.definitionId)
  if (!pdResp.data)
    return
  pd.value = pdResp.data
  const varResp = await variableInstance({processInstanceIdIn: [resp.data.id], sorting: sorting.value},
    {firstResult: 0, maxResults: 50, deserializeValues: false})
  if (!varResp.data)
    return
  variables.value = varResp.data
}

loadData()

const left = ref<Array<{ title: string, key: string, pd?: boolean, }>>([
  {
    title: 'Instance Id',
    key: 'id'
  },
  {
    title: 'Business Key',
    key: 'businessKey'
  },
  {
    title: 'Definition Version',
    key: 'version',
    pd: true
  },
  {
    title: 'Definition Id',
    key: 'definitionId'
  },
  {
    title: 'Definition Key',
    key: 'key',
    pd: true
  },
  {
    title: 'Definition Name',
    key: 'name',
    pd: true
  },
  {
    title: 'Tenant ID',
    key: 'tenantId'
  },
  {
    title: 'Deployment ID',
    key: 'deploymentId',
    pd: true
  },
  {
    title: 'Super Process Instance ID',
    key: 'super'
  }
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
