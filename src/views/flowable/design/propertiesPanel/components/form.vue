<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Forms</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-autocomplete
        v-model="formRef"
        :loading="loading"
        v-model:search="formSearch"
        variant="outlined"
        :items="items"
        density="comfortable"
        hide-details
        item-title="name"
        return-object
        clearable
        hide-no-data
        label="form"
        @update:modelValue="updateElementFormRef"
      >
        <template v-slot:append-item>
          <div v-intersect.quiet="scroll"></div>
        </template>

      </v-autocomplete>

      <v-select
        variant="outlined"
        density="comfortable"
        hide-details
        label="binding" v-model="binding" :items="bindingOptions"
        @update:modelValue="updateElementFormBinding"
      ></v-select>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";
import {useLoading} from "@/hooks";
import {CamundaResource} from "@/enum";
import {deploymentCount, deploymentList} from "@/service";
import {debounce} from 'lodash-es'
import * as stream from "stream";

const formRef = ref<string>("")
const formRefVersion = ref<string>("")
const formSearch = ref<string>("")
const modelStore = useModelStore()
const element = modelStore.getActive
const items = ref<Array<ApiFlowManagement.deployment>>([])
const businessObject = getBusinessObject(element);
const binding = ref<string>("")
//TODO version binding
const bindingOptions = ref<Array<string>>(['latest'])
const {loading, startLoading, endLoading} = useLoading()
const tip = usePropertyTip(formRef)
const getFormRef: () => string = () => {
  return businessObject.get('camunda:formRef');
};

if (getFormRef()) {
  formRef.value = getFormRef()
}

const getFormRefBinding: () => string = () => {
  return businessObject.get('camunda:formRefBinding');
};

if (getFormRefBinding()) {
  binding.value = getFormRefBinding()
}
const total = ref()
const page = ref(1)
const pageSize = ref(10)
const hasCount = ref<boolean>(false)

const getTableData = async () => {
  if (total.value && items.value.length >= total.value) {
    return
  }
  const req: ApiFlowManagement.deployList = {
    firstResult: (page.value - 1) * pageSize.value,
    maxResults: pageSize.value,
    source: CamundaResource.form
  }
  if (formSearch.value && formSearch.value.length > 0) {
    req.nameLike = formSearch.value + '%'
  }
  req.sortBy = 'deploymentTime'
  req.sortOrder = 'desc'
  startLoading();
  if (!hasCount.value) {
    const resp = await deploymentCount(req)
    if (resp.data) {
      total.value = resp.data.count
    }
    hasCount.value = true
  }
  const {data} = await deploymentList(req);
  endLoading();
  if (data) {
    items.value = items.value.concat(data)
  }
}


const watchToggle = debounce(() => {
  getTableData()
}, 200)
watch(formSearch, n => {
  resetParam()
  watchToggle()
})

const resetParam = () => {
  hasCount.value = false
  total.value = undefined
  items.value = []
}


const scroll = (e) => {
  if (!!e) {
    page.value = page.value + 1
    getTableData()
  }
}

getTableData()


const updateElementFormRef = async (value?: ApiFlowManagement.deployment) => {
  if (!value)
    return
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRef': value.name
    }
  });
}
const updateElementFormBinding = (value?: string) => {
  if (!value)
    return
  modelStore.getCommandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: getBusinessObject(element),
    properties: {
      'camunda:formRefBinding': value
    }
  });
}

</script>

<style scoped>

</style>
