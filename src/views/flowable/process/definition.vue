<template>
  <v-layout>
    <v-card>
      <v-card-title>Invoice Review</v-card-title>
      <v-card-text>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const {currentRoute} = useRouter()
const processDefinitionId = currentRoute.value.params['id'] as string

window.$snackBar?.success(processDefinitionId)
</script>

<style scoped lang="scss">

.preview-item {
  &:deep(.bjs-powered-by) {
    display: none;
  }
}
</style>
