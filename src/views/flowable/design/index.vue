<template>
  <div class="flex-grow-1 h-100 d-flex flex-column">
    <v-toolbar rounded flat elevation="1" color="surface" class="mb-2">
      <v-toolbar-title class="text-primary font-weight-bold">Flow Design</v-toolbar-title>
      <v-spacer/>
      <v-btn
        variant="outlined"
        size="small"
        color="primary"
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
    </v-toolbar>
    <div class="content flex-grow-1 elevation-2 d-flex justify-space-between">
      <div class="position-relative">
        <designer :xml="demoXML" @commandStackChanged="exportArtifacts">
          <template #right>
        <span class="canvas-help d-flex flex-column">
          <v-btn
            size="small"
            class="top-z-index"
            icon
            color="primary"
            variant="plain"
            @click="scrollZoom(1)"
          >
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
          <v-btn
            size="small"
            class="top-z-index"
            icon
            color="primary"
            variant="plain"
            @click="scrollZoom(-1)"
          >
            <v-icon icon="mdi-minus"></v-icon>
          </v-btn>
          <v-btn
            size="small"
            icon
            class="top-z-index"
            color="primary"
            variant="plain"
            @click="canvasFitViewport"
          >
            <v-icon icon="mdi-arrow-u-right-top"></v-icon>
          </v-btn>
          <v-btn
            size="small"
            icon
            class="top-z-index"
            color="primary"
            @click="showXml"
            variant="plain"
          >
            <v-icon icon="mdi-xml"></v-icon>
          </v-btn>
        </span>
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
import demo from './demo3.bpmn?raw'
import {ref} from 'vue'
import PropertiesPanel from "@/views/flowable/design/propertiesPanel/index.vue";
import {Codemirror} from 'vue-codemirror'
import Designer from "@/views/flowable/design/design";
import {useModelStore} from '@/store'
import {getNameValue} from "@/views/flowable/bo-utils/nameUtil";
import {deploymentCreate} from "@/service/api/flow";
import {useLoading} from "@/hooks";

const properties = ref<InstanceType<typeof PropertiesPanel> | null>()
const modelStore = useModelStore()
const downloadSvg = ref<HTMLElement | undefined>()
const downloadDiagram = ref<HTMLElement | undefined>()
const changed = ref(false)
const xmlDialog = ref(false)
const xmlContent = ref("")
const demoXML = ref<string>(demo)
const {loading: deployLoading} = useLoading()

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

  const request: ApiFlowManagement.deployCreate = {
    name: getNameValue(modelStore.getActive) || 'tmp',
    source: 'lulu-oa',
    "deployment-file": undefined
  }

  try {
    const {xml} = await modelStore.getModeler.saveXML({format: true});
    const blob = new Blob([xml], {type: 'application/bpmn20-xml;charset=UTF-8'});
    request["deployment-file"] = new File([blob], request.name + '.xml', {type: "application/bpmn20-xml;charset=UTF-8"})
    deployLoading.value = true
    const r = await deploymentCreate(request)
    deployLoading.value = false
    if (r.data) {
      window.$snackBar?.success(`deploy flow ${request.name} success`)
    }

  } catch (err) {

    console.error('Error happened saving XML: ', err);
    window.$snackBar?.error('Error happened saving XML: ' + err)
  }
}

const testCamundaProperties = () => {
  canvasFitViewport()
}

const canvasFitViewport = () => {
  modelStore.getModeler.get('canvas').zoom('fit-viewport', 'auto');
}

const scrollZoom = (s: number) => {
  modelStore.getModeler.get('zoomScroll').stepZoom(s);
}


const showXml = async () => {
  xmlDialog.value = true
  const {xml} = await modelStore.getModeler.saveXML({format: true});
  xmlContent.value = xml
}
</script>


<style scoped lang="scss">

.content {

  .canvas-help {
    position: absolute;
    right: 10px;
  }

  .canvas {
    background-color: rgb(var(--v-theme-surface));
    position: absolute;
  }

  &, div {
    width: 100%;
    height: 100%;

    :deep(.bjs-powered-by) {
      display: none;
    }

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
