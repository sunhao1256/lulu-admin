<template>
  <v-expansion-panel
  >
    <v-expansion-panel-title>
      <span>Documentation</span>
      <v-spacer/>
      <span v-show="tip" class="panel-title-tip mr-1"></span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-textarea variant="outlined" label="Element Documentation" density="comfortable" hide-details
                  v-model="elementDoc" @change="updateElementDoc"></v-textarea>
    </v-expansion-panel-text>
  </v-expansion-panel>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useModelStore} from '@/store'
import EventEmitter from "@/utils/flow/EventEmitter";
import {getDocumentValue, setDocumentValue} from "@/views/flowable/bo-utils/documentationUtil";
import {usePropertyTip} from "@/hooks/flow/propertyTip";

const elementDoc = ref<String>("")

const tip = usePropertyTip(elementDoc)
const modelStore = useModelStore()

const updateElementDoc = (value: any) => {
  setDocumentValue(modelStore.getActive, value.target.value)
}

onMounted(() => {
  elementDoc.value = getDocumentValue(modelStore.getActive || '')
  EventEmitter.on('element-update', () => {
    elementDoc.value = getDocumentValue(modelStore.getActive || '')
  })
})


</script>

<style scoped>

</style>
