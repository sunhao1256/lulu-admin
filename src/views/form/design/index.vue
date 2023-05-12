<template>
  <v-layout class="h-100">
    <v-navigation-drawer width="250" :permanent="true">
      <v-list>
        <v-list-item>
          <div class="text-h5 font-weight-bold">Form Component</div>
        </v-list-item>
        <v-list-item v-for="component in formComponents">
          <v-list-item-title>
            {{ component.name }}
          </v-list-item-title>
          <v-list-item-action>
            <div v-if="component.children" class="component-list d-flex flex-row w-100  flex-wrap ">
              <draggable :list="component.children" item-key="name"
                         :clone="cloneComponent"
                         @end="endComponent"
                         :sort="false"
                         :group="{ name: 'formComponentGroups', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <v-chip label color="primary" class="component-list-item cursor-move" @click="addComponent(element)">
                    {{ element.name }}
                  </v-chip>
                </template>
              </draggable>
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer width="250" :permanent="true" location="right">
      <v-card elevation="0">
        <v-card-title>
          Attribute
        </v-card-title>
        <v-card-text>
          <formitem-edit v-if="!!activeComponent" v-model="activeComponent"></formitem-edit>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-main class="form-design">
      <v-card elevation="0" class="h-100">
        <v-card-title class="d-flex align-center">
          <v-text-field density="comfortable" hide-details
                        variant="filled"
                        placeholder="formName"
                        v-model="form.name"
                        class="v-text-field-rounded pl-0 "
          ></v-text-field>

          <v-spacer/>
          <span class="text-caption">{{ form.id }}</span>
          <v-btn variant="tonal" color="primary" @click="showPreview()"
                 :disabled="selectedFormComponents.length===0">Preview
          </v-btn>
          <v-btn variant="tonal" color="success" class="ml-1" @click="deploy()"
                 :loading="deployLoading"
                 :disabled="selectedFormComponents.length===0">Deploy
          </v-btn>
          <v-btn variant="tonal" color="error" class="ml-1" :disabled="selectedFormComponents.length===0"
                 @click="selectedFormComponents=[]">ClearAll
          </v-btn>
        </v-card-title>
        <v-card-text class="px-0">
          <v-form class="px-1">
            <div v-if="selectedFormComponents.length === 0" class="px-1 text-h6 text-primary position-absolute">
              drag component from left panel
              to here !
            </div>
            <draggable
              :list="selectedFormComponents"
              class="draggable-area"
              :animation="340"
              group="formComponentGroups"
              ghost-class="ghost"
              item-key="id"
            >
              <template #item="{ element,index }">
                <formitem :item="element"
                          :active="activeComponent"
                          :list="selectedFormComponents"
                          :id-prefix="form.id"
                          v-model="element.modelValue"
                          :index="index"
                          @delete="deleteComponent"
                          @duplicate="duplicateComponent"
                          @selected="selectComponent"/>
              </template>
            </draggable>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
    <v-dialog max-width="600" v-model="previewDialog">
      <form-preview :components="selectedFormComponents" :form="form">
        <template #title>
          <v-spacer/>
          <v-btn icon variant="flat">
            <v-icon @click="previewDialog=false">mdi-close</v-icon>
          </v-btn>
        </template>
        <template #actions>
          <v-spacer/>
          <v-btn color="primary" @click="previewSubmit">submit</v-btn>
        </template>
      </form-preview>
    </v-dialog>
  </v-layout>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import Formitem from "@/views/form/design/components/formitem";
import {cloneDeep} from 'lodash-es'
import formComponentsGetter from "./formComponents";
import FormitemEdit from "@/views/form/design/components/formitemEdit";
import {deploymentCreate, deploymentResourceData, deploymentResources} from "@/service";
import {useLoading} from "@/hooks";
import {CamundaResource} from "@/enum";
import {useRouter} from "vue-router";
import FormPreview from "@/views/form/design/preview";
import {uniqueId} from "@/utils";
import useVuelidate from "@vuelidate/core";

const {currentRoute} = useRouter()
const v$ = useVuelidate()
const deploymentId = ref(currentRoute.value.params['id'] as string)
const resource = ref<Partial<ApiFlowManagement.resource>>({})


const loadResource = async () => {
  if (deploymentId.value && deploymentId.value.length > 0) {
    window.$loadingOverly?.show()
    const {data} = await deploymentResources(deploymentId.value)
    if (data && data.length > 0) {
      // form deployment only contains single attachment
      resource.value = data[0]
    }
    if (resource.value.id) {
      const {data} = await deploymentResourceData(deploymentId.value, resource.value.id)
      if (data) {
        selectedFormComponents.value = data.components
        form.id = data.id
        form.name = data.id
        if (selectedFormComponents.value.length > 0) {
          selectComponent(selectedFormComponents.value[0])
        }
      }
    }
    window.$loadingOverly?.hide()

  }
}

loadResource()

const form = reactive<form>({
  id: 'Form' + uniqueId(),
})

form.name = form.id
const activeComponent = ref<formComponent>()
const previewDialog = ref<boolean>(false)
const theme = useTheme();
const formComponents = formComponentsGetter(theme.current.value.colors.primary)
const cloningComponent = ref<formComponent>()
const selectedFormComponents = ref<Array<formComponent>>([])
const selectComponent = (c: formComponent) => {
  activeComponent.value = c
}
if (selectedFormComponents.value.length > 0) {
  selectComponent(selectedFormComponents.value[0])
}
const endComponent = (c: { to: any, from: any }) => {
  if (c.from != c.to) {
    cloningComponent.value && selectComponent(cloningComponent.value)
  }
}
const addComponent = (c: formComponent) => {
  c = cloneComponent(c)
  cloningComponent.value = c
  activeComponent.value = cloningComponent.value
  selectedFormComponents.value.push(activeComponent.value)
}
const cloneComponent = (c: formComponent) => {
  const clone = cloneDeep(c)
  clone.id = form.id + '_' + uniqueId()
  cloningComponent.value = clone
  return clone
}

const deleteComponent = (c: formComponent) => {
}
const duplicateComponent = (c: formComponent) => {
}

const showPreview = () => {
  previewDialog.value = true
  console.log(JSON.stringify(selectedFormComponents.value))
}

const {loading: deployLoading} = useLoading()
const deploy = async () => {

  const request: Partial<ApiFlowManagement.deployCreate> = {
    "deployment-name": form.name,
    "enable-duplicate-filtering": true,
    "deployment-source": CamundaResource.form
  }
  // remove modelValue
  selectedFormComponents.value.forEach(c => c.modelValue = undefined)
  const fileContent = {
    id: form.name,
    components: selectedFormComponents.value
  }

  try {
    const formComponents = JSON.stringify(fileContent)
    const blob = new Blob([formComponents]);
    const file = new File([blob], request["deployment-name"] + '.form')
    request[file.name] = file
    deployLoading.value = true
    const r = await deploymentCreate(request)
    deployLoading.value = false
    if (r.data) {
      window.$snackBar?.success(`deploy form ${request["deployment-name"]} success`)
    }
  } catch (err) {
    console.error('Error happened saving form: ', err);
    window.$snackBar?.error('Error happened saving form: ' + err)
  }
}


const previewSubmit = () => {
  v$.value.$validate().then(valid => {
    if (valid) {
      window?.$snackBar?.success("preview form submitted !")
    }
  })
}
</script>

<style scoped lang="scss">

.component-list {
  margin-right: -8px;
  margin-bottom: -8px;

  .component-list-item {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.form-design {
  &:deep(.ghost) {
    position: relative;
    display: block;
    min-height: 60px;
    flex-grow: 1;
    flex-basis: 0;
    //height: 60px;

    &::before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 4px;
      background: rgb(var(--v-theme-primary));
      z-index: 2;
    }
  }

  .draggable-area {

    min-height: 500px;

    &:deep(.form-item) {
      position: relative;
      margin-bottom: 8px;
      border: 1px dashed #ccc;


      .form-item-active-options {
        z-index: 10;
        position: absolute;
        right: 0;
        top: -10px;
      }

      .form-item-active-flex {
        z-index: 10;
        position: absolute;
        left: 0;
        top: -10px
      }
    }

    &:deep(.form-item:last-child) {
      margin-bottom: 0;
    }

    &:deep(.form-item-active) {
      background-color: rgb(var(--v-theme-primary), 0.1);
      border: none;
    }
  }
}
</style>
