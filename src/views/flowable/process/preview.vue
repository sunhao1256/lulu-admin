<template>
  <v-row class="preview">
    <v-col v-for="p in items" :cols="3">
      <viewer :process-result="p" class="viewer"></viewer>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {loadListProcessResultStatistics} from "@/views/flowable/process/helper";
import Viewer from "@/views/flowable/components/viewer";

const {loading, loadData, items} = loadListProcessResultStatistics()

async function init() {
  await loadData()
}

init()
</script>

<style scoped lang="scss">
.preview {
  &:deep(.preview-item) {
    .bjs-breadcrumbs, .bjs-powered-by {
      display: none;
    }
  }

  .viewer {
    min-height: 200px;
  }

}
</style>
