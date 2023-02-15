<template>
  <v-breadcrumbs class="pa-0 py-2" :items="breadcrumbs" active-color="primary">
    <template v-slot:title="{ item}">
      {{ $t((item as App.GlobalBreadcrumb ).title || 'unknown') }}
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import {PropType} from 'vue';

defineProps({
  breadcrumbs: {
    type: Array as PropType<Array<App.GlobalBreadcrumb>>,
    default: () => []
  }
})

</script>

<style scoped></style>
