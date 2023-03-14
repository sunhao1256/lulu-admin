<template>
  <div class="flex-grow-1 h-100 d-flex flex-column">
    <div class="d-flex mb-1">
      <div class="text-h5 text-primary font-weight-bold">Flow Design</div>
      <div class="d-flex flex-grow-1  align-center justify-end">
        <v-btn
          variant="outlined"
          size="small"
          color="primary"
          :disabled="!changed"
          @click="downloadSvg?.click()"
        >
          Download SVG
        </v-btn>
        <a ref="downloadSvg" class="d-none" href></a>
        <v-btn
          variant="outlined"
          size="small"
          class="ml-1"
          :disabled="!changed"
          @click="downloadDiagram?.click()"
          color="primary"
        >
          Download Diagram
        </v-btn>
        <a ref="downloadDiagram" class="d-none" href></a>
      </div>
    </div>
    <div class="content flex-grow-1 elevation-2 d-flex justify-space-between">
      <div class="canvas" id="js-canvas" ref="canvas"></div>
      <div id="js-properties-panel" class="properties-panel-parent" ref="properties"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BpmnModeler from 'bpmn-js/lib/Modeler'
import {debounce} from 'lodash-es'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css'
import demo from './demo3.bpmn?raw'
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import camundaModdleDescriptors from 'camunda-bpmn-moddle/resources/camunda';
import customTranslate from "./customTranslate";
import {ref} from 'vue'

const canvas = ref<HTMLElement | undefined>()
const properties = ref<HTMLElement | undefined>()
const bpmnModeler = ref()
const downloadSvg = ref<HTMLElement | undefined>()
const downloadDiagram = ref<HTMLElement | undefined>()
const changed = ref(false)

onMounted(async () => {
  bpmnModeler.value = new BpmnModeler({
    container: canvas.value,
    propertiesPanel: {
      parent: properties.value
    },
    additionalModules: [
      {
        translate: ['value', customTranslate]
      },
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptors
    }
  })

  bpmnModeler.value.on('commandStack.changed', exportArtifacts);
  try {

    await bpmnModeler.value.importXML(demo);

  } catch (err) {
    window.$snackBar?.error('something went wrong: ' + err)
    console.error('something went wrong:', err);
  }
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

    const {svg} = await bpmnModeler.value.saveSVG();
    setEncoded(downloadSvg.value, 'diagram.svg', svg);
  } catch (err) {

    console.error('Error happened saving SVG: ', err);
    window.$snackBar?.error('Error happened saving SVG: ' + err)
    setEncoded(downloadSvg.value, 'diagram.svg', null);
  }
  try {

    const {xml} = await bpmnModeler.value.saveXML({format: true});
    setEncoded(downloadDiagram.value, 'diagram.bpmn', xml);
  } catch (err) {

    console.error('Error happened saving XML: ', err);
    window.$snackBar?.error('Error happened saving XML: ' + err)
    setEncoded(downloadDiagram.value, 'diagram.bpmn', null);
  }
}, 500)


</script>


<style scoped lang="scss">

.content > div {
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
}

#js-properties-panel {
  width: 400px;
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
