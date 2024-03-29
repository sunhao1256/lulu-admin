<template>
  <div class="flex-grow-1 h-100 d-flex flex-column">

    <div class="d-flex align-center">
      <div>
        <div class="text-h4">Flow Design</div>
        <breadcrumb/>
      </div>
      <v-spacer></v-spacer>
      <input
        type="file"
        ref="importRef"
        style="display: none"
        accept=".xml,.bpmn"
        @change="changeImportFile"
      >
      <v-btn
        variant="outlined"
        size="small"
        color="primary"
        @click="openImport"
      >
        Import
      </v-btn>
      <v-btn
        variant="outlined"
        size="small"
        class="ml-1"
        color="error"
        @click="erase"
      >
        Erase
      </v-btn>
      <v-btn
        variant="outlined"
        size="small"
        color="primary"
        class="ml-1"
        :disabled="!changed"
        prepend-icon="mdi-download"
        @click="downloadSvg?.click()"
      >
        SVG
      </v-btn>
      <a ref="downloadSvg" class="d-none" href="#"></a>
      <v-btn
        variant="outlined"
        size="small"
        class="ml-1"
        :disabled="!changed"
        prepend-icon="mdi-download"
        @click="downloadDiagram?.click()"
        color="primary"
      >
        Diagram
      </v-btn>
      <a ref="downloadDiagram" class="d-none" href="#"></a>
      <v-btn
        size="small"
        class="ml-1"
        variant="outlined"
        color="success"
        :loading="deployLoading"
        @click="deploy"
      >
        Deploy
      </v-btn>
    </div>
    <div class="content flex-grow-1 elevation-2 d-flex justify-space-between">
      <div class="position-relative">
        <designer :xml="demoXML" @commandStackChanged="exportArtifacts">
          <template #right>
            <navigate :viewer="viewer" v-if="!!viewer" :show-xml-btn="true" @show-xml="showXml"></navigate>
          </template>
        </designer>
      </div>
      <aside class="ml-1">
        <properties-panel ref="properties"/>
      </aside>
    </div>
    <v-dialog
      v-model="xmlDialog"
      scrollable
      width="800"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Xml Preview</span>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            icon
            variant="plain"
            @click=" xmlDialog= false"
          >
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text style="height: 800px">
          <codemirror v-model="xmlContent"></codemirror>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {debounce} from 'lodash-es'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css'
import {createNewDiagram} from './util'
import {ref} from 'vue'
import PropertiesPanel from "@/views/flowable/design/propertiesPanel/index.vue";
import {Codemirror} from 'vue-codemirror'
import Designer from "@/views/flowable/design/design";
import {useModelStore} from '@/store'
import {getNameValue} from "@/views/flowable/bo-utils/nameUtil";
import {deploymentCreate} from "@/service/api/flow";
import {useLoading} from "@/hooks";
import {useRouter} from "vue-router";
import {processDefinitionXml} from '@/service'
import Navigate from "@/views/flowable/components/navigate.vue";
import {canvasFitViewport} from "@/views/flowable/utils/BpmnCanvasUtil";
import {CamundaResource} from "@/enum";

const properties = ref<InstanceType<typeof PropertiesPanel> | null>()
const modelStore = useModelStore()
const downloadSvg = ref<HTMLElement | undefined>()
const downloadDiagram = ref<HTMLElement | undefined>()
const changed = ref(false)
const xmlDialog = ref(false)
const xmlContent = ref("")
const demoXML = ref<string>()
const {loading: deployLoading} = useLoading()

const viewer = computed(() => {
  return modelStore.getModeler
})

const setEncoded = (link: HTMLElement | undefined, name: string, data: any) => {
  var encodedData = encodeURIComponent(data);
  if (link && data) {
    changed.value = true
    link.setAttribute(
      'href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
    );
    link.setAttribute('download', name)
  }
}
const exportArtifacts = debounce(async () => {
  try {

    const {svg} = await modelStore.getModeler.saveSVG();
    setEncoded(downloadSvg.value, 'diagram.svg', svg);
  } catch (err) {

    console.error('Error happened saving SVG: ', err);
    window.$snackBar?.error('Error happened saving SVG: ' + err)
    setEncoded(downloadSvg.value, 'diagram.svg', null);
  }
  try {

    const {xml} = await modelStore.getModeler.saveXML({format: true});
    setEncoded(downloadDiagram.value, 'diagram.bpmn', xml);
  } catch (err) {

    console.error('Error happened saving XML: ', err);
    window.$snackBar?.error('Error happened saving XML: ' + err)
    setEncoded(downloadDiagram.value, 'diagram.bpmn', null);
  }
}, 500)


const deploy = async () => {
  const dialog = window.$dialog?.show({
    main: 'Confirm Deploy Process ?',
    confirm: async () => {
      dialog?.confirmLoading(true)
      await doDeploy()
      dialog?.close()
    }
  })
}

const doDeploy = async () => {
  if (!modelStore.getCanvas) {
    window.$snackBar?.error('Model Canvas Mandatory')
    return
  }
  const root = modelStore.getCanvas.getRootElement()
  const request: Partial<ApiFlowManagement.deployCreate> = {
    "name": getNameValue(root),
    "enableDuplicateFilter": true,
    "source": CamundaResource.process
  }

  try {
    const {xml} = await modelStore.getModeler.saveXML({format: true});
    const blob = new Blob([xml]);
    request['deploymentFile'] = new File([blob], request["name"] + '.bpmn')
    console.log(request)
    deployLoading.value = true
    const r = await deploymentCreate(request)
    deployLoading.value = false
    if (r.data) {
      window.$snackBar?.success(`deploy flow ${request["name"]} success`)
    }

  } catch (err) {

    console.error('Error happened saving XML: ', err);
    window.$snackBar?.error('Error happened saving XML: ' + err)
  }
}
const showXml = async () => {
  xmlDialog.value = true
  const {xml} = await modelStore.getModeler.saveXML({format: true});
  xmlContent.value = xml
}

const erase = () => {
  const command = modelStore.getCommandStack
  command && command.clear()
  createNewDiagram()
}

const importRef = ref<HTMLInputElement | null>(null)

const openImport = () => {
  importRef.value && importRef.value.click()
}

const changeImportFile = () => {
  if (importRef.value && importRef.value.files) {
    const file = importRef.value.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = async function () {
      const xmlStr = this.result
      await modelStore.getModeler!.importXML(xmlStr as string)
      canvasFitViewport(modelStore.getModeler)
    }
    importRef.value.value = ''
    importRef.value.files = null
  }
}

const {currentRoute} = useRouter()
const processDefinitionId = currentRoute.value.params['id'] as string

const init = async () => {
  if (!processDefinitionId || processDefinitionId.length == 0)
    return

  const resp = await processDefinitionXml(processDefinitionId)
  if (resp.data) {
    demoXML.value = resp.data.bpmn20Xml
    await modelStore.getModeler!.importXML(demoXML.value)
    canvasFitViewport(modelStore.getModeler)
  }
}

init()

</script>


<style scoped lang="scss">

.content {


  .canvas {
    background-color: rgb(var(--v-theme-surface));
    position: absolute;
  }

  &, div {
    width: 100%;
    height: 100%;


  }
}

.properties-panel-parent {
  border-left: 1px solid rgb(var(--v-theme-background));
  overflow: auto;

  &:empty {
    display: none;
  }

  > .djs-properties-panel {
    padding-bottom: 70px;
    min-height: 100%;
  }
}


</style>
