<template>
  <div class="d-flex flex-column flex-grow-1 h-100">
    <v-layout>
      <v-navigation-drawer permanent color="background">
        <v-list>
          <v-list-item>
            <v-list-item-title>Definition Version</v-list-item-title>
            <v-select :items="fds" :item-value="(e)=>e" @update:modelValue="switchVersion" v-model="fd"
                      item-title="version" density="comfortable"
                      hide-details
                      variant="outlined"
            ></v-select>
          </v-list-item>
          {{fd.id}}
          <v-list-item v-for="v in left">
            <v-list-item-title>{{ v.title }}</v-list-item-title>
            <copy-label v-if="fd[v.key]" :text="fd[v.key]"/>
            <span v-else>null</span>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <div>
          <form-preview :components="selectedFormComponents" :form="form">
            <template #actions>
              <v-spacer/>
              <v-btn color="primary" @click="previewSubmit">submit</v-btn>
            </template>
          </form-preview>
        </div>
      </v-main>
    </v-layout>

  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {
  deploymentResourceData,
  deploymentResources,
  formDefinitions
} from "@/service";
import {ref, watch, reactive} from 'vue'
import FormPreview from "@/views/form/design/preview";
import useVuelidate from "@vuelidate/core";

const {currentRoute} = useRouter()
const formDefinitionId = ref(currentRoute.value.params['id'] as string)
const fd = ref<Partial<ApiFlowManagement.FormDefinition>>({})
const fds = ref<ApiFlowManagement.FormDefinition[]>([])
const selection = ref<string[]>([])
const watchToggle = async () => {
  await init()
}
const form = reactive<form>({
  id: '',
  name: ''
})
const selectedFormComponents = ref<Array<formComponent>>([])

const loadResource = async () => {
  if (fd.value && fd.value.deploymentId && fd.value.deploymentId?.length > 0) {
    window.$loadingOverly?.show()
    const {data: resources} = await deploymentResources(fd.value.deploymentId)
    if (resources && resources.length > 0) {
      if (resources[0].id) {
        const {data} = await deploymentResourceData(fd.value.deploymentId, resources[0].id)
        if (data) {
          selectedFormComponents.value = data.components
          form.id = data.id
          form.name = data.id
        }
      }
    }
    window.$loadingOverly?.hide()

  }
}
const init = async () => {
  const resp = await formDefinitions({
    id: formDefinitionId.value
  })
  if (!resp.data || resp.data.length == 0) {
    return
  }
  fd.value = resp.data[0]

  loadResource().then()

  formDefinitions({
    key: fd.value.key,
    sortBy: 'version',
    sortOrder: 'desc'
  }).then(fdsResp => {
    if (!fdsResp.data) {
      return
    }
    fds.value = fdsResp.data
  })
}
const route = useRoute()
const useParams = computed(() => route.params['id'])
watch(useParams, (r, o) => {
  if (!r)
    return
  formDefinitionId.value = r as string
  watchToggle()
}, {immediate: true})


const router = useRouter()
const switchVersion = (fd: ApiFlowManagement.FormDefinition) => {
  v$.value.$reset()
  if (fd && fd.id)
    router.replace({path: `/form/definition/${fd.id}`})
}

const v$ = useVuelidate()

const previewSubmit = () => {
  v$.value.$validate().then(valid => {
    if (valid) {
      window?.$snackBar?.success("preview form submitted !")
    }
  })
}

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

</style>
