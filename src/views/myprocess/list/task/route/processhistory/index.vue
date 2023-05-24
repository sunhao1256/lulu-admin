<template>
  <v-timeline direction="horizontal" class="pa-2">
    <v-timeline-item size="small" v-for="act in actIns" :dot-color="dotColor(act)" :icon="dotIcon(act)">
      <template v-slot:opposite>
        <span>{{ act.activityName || act.activityId }}</span>
      </template>
      <v-card class="elevation-2" max-width="300">
        <v-card-title class="text-h5">
          {{ act.activityName || act.activityId }}
        </v-card-title>
        <v-card-text class="process-history">
          <div class="item">
            <span class="title">Opinion</span>
            <span class="value">Agree</span>
          </div>
          <div class="item">
            <span class="title">StartTime</span>
            <span class="value">{{ act.startTime }}</span>
          </div>
          <div class="item">
            <span class="title">EndTime</span>
            <span class="value">{{ act.endTime }}</span>
          </div>
          <div class="item">
            <span class="title">Duration</span>
            <span class="value">{{ act.durationInMillis }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts" setup>
import {getHistoryActIns} from "@/views/myprocess/list/task/helper";

const {loading, fetch, actIns} = getHistoryActIns()

const props = defineProps(
  {
    pId: {
      type: String,
      required: true
    },
  }
)
const init = async () => {
  await fetch({
    processInstanceId: props.pId,
    sortBy: 'startTime',
    sortOrder: "asc"
  })
}

const dotColor = (act: ApiFlowManagement.HistoricActivityInstance) => {
  if (act.endTime) {
    return 'success'
  } else {
    return 'primary'
  }
}
const dotIcon = (act: ApiFlowManagement.HistoricActivityInstance) => {
  if (act.endTime) {
    return 'mdi-check'
  } else {
    return ''
  }
}

init()

</script>

<style scoped>

.process-history {
  .item {
    .title {
      font-size: 12px !important;

      &::after {
        content: ':';
        margin-left: 3px;
        margin-right: 5px;
      }
    }
  }
}
</style>
