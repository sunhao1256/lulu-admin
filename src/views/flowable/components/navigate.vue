<template>
  <span class="canvas-help d-flex flex-column">
    <v-btn
      size="small"
      class="top-z-index"
      icon
      color="primary"
      variant="plain"
      @click="scrollZoom(viewer,1)"
    >
      <v-icon icon="mdi-plus"></v-icon>
    </v-btn>
    <v-btn
      size="small"
      class="top-z-index"
      icon
      color="primary"
      variant="plain"
      @click="scrollZoom(viewer,-1)"
    >
      <v-icon icon="mdi-minus"></v-icon>
    </v-btn>
    <v-btn
      size="small"
      icon
      class="top-z-index"
      color="primary"
      variant="plain"
      @click="canvasFitViewport(viewer)"
    >
      <v-icon icon="mdi-fit-to-page-outline"></v-icon>
    </v-btn>
    <v-btn
      size="small"
      icon
      class="top-z-index"
      v-if="showXmlBtn"
      color="primary"
      @click="showXml"
      variant="plain"
    >
      <v-icon icon="mdi-xml"></v-icon>
    </v-btn>
  </span>
</template>

<script lang="ts" setup>
import {canvasFitViewport, scrollZoom} from '../utils/BpmnCanvasUtil'

const props = defineProps({
  viewer: {
    type: Object,
    required: true
  },
  showXmlBtn: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['showXml'])
const showXml = () => {
  emit('showXml')
}


</script>

<style scoped>
.canvas-help {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
