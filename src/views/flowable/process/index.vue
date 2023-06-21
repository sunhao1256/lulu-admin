<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">Flows</div>
        <breadcrumb/>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="text-capitalize" color="primary" to="/flowable/design">
        Create Flow
      </v-btn>
    </div>
    <v-row>
      <v-col lg="2" md="3" sm="3" class="pr-0">
        <v-list-item>
          <div class="d-flex justify-space-between text-h5">Groups
            <v-btn icon density="comfortable" variant="plain" color="error" @click="adding=!adding">
              <v-icon size="small">{{ adding ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
            </v-btn>
          </div>
          <v-expand-transition>
            <v-card v-if="adding" class="mt-1">
              <v-card-text>
                <v-text-field @keyup.enter="confirmAdd" v-model="addGroup.name" label="Group Name" class="mx-1 mt-1"
                              autofocus
                              :error-messages="addV$.name.$errors.map(e => e.$message) as string|string[]"
                ></v-text-field>
                <div class="d-flex justify-space-around align-center">
                  <v-btn size="small" @click="cancelAdd">cancel</v-btn>
                  <v-btn size="small" @click="confirmAdd" :loading="addLoading" color="primary">confirm</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-list-item>
        <v-divider/>
        <v-list v-model:selected="selectedGroup" rounded :items="groups" style="background: none" mandatory
                v-if="groups.length>0">
          <template v-for="g in groups">
            <v-hover v-slot="{isHovering, props}">
              <v-list-item class="mt-1" rounded v-bind="props" active-color="primary" :value="g.id">
                {{ g.name }}
                <template #append>
                  <v-btn icon density="comfortable" v-if="isHovering" variant="plain" color="error"
                         @click.stop="editGroup">
                    <v-icon size="small">mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-hover>
          </template>
        </v-list>
<!--        <div v-else class="d-flex justify-center align-center text-h5  text-orange-darken-4 font-weight-bold"-->
<!--             style="min-height: 300px">-->
<!--          No any Groups-->
<!--        </div>-->
      </v-col>
      <v-col>
        <v-tabs :show-arrows="false" background-color="transparent" color="primary" class="my-2">
          <v-tab :to="`/flowable/processes/${selectedGroupId?selectedGroupId+'/':''}list`">List</v-tab>
          <v-tab :to="`/flowable/processes/${selectedGroupId?selectedGroupId+'/':''}preview`">Preview</v-tab>
        </v-tabs>
        <v-window>
          <router-view v-slot="{ Component }">
            <v-fade-transition mode="out-in">
              <component :key="selectedGroupId" :is="Component"/>
            </v-fade-transition>
          </router-view>
        </v-window>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {processDefinitionGroupAdd, processDefinitionGroupList} from "@/service";
import {useLoading} from "@/hooks";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useRouter} from "vue-router";

const initialGroup = {
  name: ''
}
const {currentRoute} = useRouter()
const groupId = ref(currentRoute.value.params['gId'] as string)
const addGroup = reactive({...initialGroup})
const selectedGroup = ref<string[]>([])
if (groupId.value && groupId.value.length > 0) {
  selectedGroup.value.push(groupId.value)
}
const adding = ref(false)
const groups = ref<ApiFlowManagement.ProcessDefinitionGroup[]>([])

const cancelAdd = () => {
  adding.value = false
  addV$.value.$reset()
  Object.assign(addGroup, initialGroup)
}
const rule = {
  name: {required}
}
const selectedGroupId = computed(() => {
  if (selectedGroup.value.length > 0) {
    return selectedGroup.value[0]
  } else {
    return undefined
  }
})
const addV$ = useVuelidate(rule, addGroup)
const {loading: addLoading} = useLoading()
const confirmAdd = async () => {
  addV$.value.$validate().then(async valid => {
    if (valid) {
      addLoading.value = true
      const {error} = await processDefinitionGroupAdd({
        name: addGroup.name
      })
      addLoading.value = false
      if (!error) {
        cancelAdd()
        await listGroup()
      }
    }
  })
}
const editGroup = () => {
}

const listGroup = async () => {
  const {data} = await processDefinitionGroupList()
  if (data) {
    groups.value = data
  }
}
const {push} = useRouter()
const _selectGroup = (id: string) => {
  push(`/flowable/processes/${id}/list`)
}

watch(selectedGroupId, (n) => {
  if (n)
    _selectGroup(n)
})


const init = async () => {
  await listGroup()
  if (groups.value.length > 0) {
    if (groupId.value && groupId.value.length > 0) {
      // prevent push action, user specify purpose groupId manually
    } else {
      selectedGroup.value.push(groups.value[0].id)
    }
  } else {
    await push(`/flowable/processes/list`)
  }
}

init()
</script>

<style scoped lang="scss">
.group-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;

  & .title {
    color: red;
  }
}
</style>
