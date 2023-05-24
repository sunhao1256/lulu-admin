<template>

  <div class="d-flex flex-column flex-grow-1 h-100">
    <div class="d-flex align-center py-3">
      <div class="text-h4 d-flex align-end">{{ `${task?.name || task?.id}` }}
        <v-btn
          size="small"
          variant="text"
          append-icon="mdi-open-in-new"
          :to="`/flowable/process-definition/${processDef?.id}/process-instance?version=${processDef?.version}`">
          {{processDef?.name || processDef?.key}} {{ 'v' + processDef?.version}}
        </v-btn>
      </div>
    </div>
    <v-layout class="h-100">
      <v-navigation-drawer location="right" width="300" permanent rounded>
        <v-card elevation="0">
          <v-card-title class="align-center">
            <v-btn icon variant="flat" @click="commentLayout=!commentLayout" class="mr-1">
              <v-icon>mdi-history</v-icon>
            </v-btn>
            Deal Task
          </v-card-title>
          <v-card-text>
            <form>
              <v-textarea label="comment" variant="outlined"
                          :error-messages="commentV$.comment.$errors.map(e => e.$message) as string|string[]"
                          v-model="comment"></v-textarea>
              <v-btn variant="tonal" @click="leavecomment">Leave comment</v-btn>
            </form>
          </v-card-text>
        </v-card>
        <form-preview :components="deployedForm?.components || []"
                      elevation="0"
                      :form="{id:deployedForm?.id || ''}">
          <template #actions>
            <v-card-title class="px-0">Actions</v-card-title>
            <v-btn color="primary" variant="tonal" @click="submit">Agree</v-btn>
            <v-btn color="error" variant="tonal" class="ml-1">Disagree</v-btn>
          </template>
        </form-preview>
      </v-navigation-drawer>
      <v-navigation-drawer location="right" v-model="commentLayout" :permanent="comments.length>0">
        <v-card elevation="0">
          <v-card-title>Comments</v-card-title>
          <v-list class="comment-item" v-for="c in comments">
            <v-list-item class="d-flex justify-space-between">
              <v-list-item-title>
                <span class="user">{{ c.userId || 'None' }}</span>
                <span class="time">{{ c.time }}</span>
              </v-list-item-title>
              <span class="value">{{ c.message }}</span>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
      <v-main>
        <v-card class="h-100">
          <v-tabs background-color="transparent" color="primary" class="overflow-visible">
            <v-tab :to="`/my-process/task/${taskId}/form`">{{ t('menu.my-process-task-form') }}</v-tab>
            <v-tab :to="`/my-process/task/${taskId}/process`">{{ t('menu.my-process-task-process') }}</v-tab>
            <v-tab :to="`/my-process/task/${taskId}/processhistory`">{{ t('menu.my-process-task-processhistory') }}
            </v-tab>
          </v-tabs>
          <v-window class="h-100" v-if="!!task">
            <router-view v-slot="{ Component }">
              <v-fade-transition mode="out-in">
                <!--               should cache -->
                <keep-alive>
                  <component :is="Component" :pd="processDef" :pId="task.processInstanceId"/>
                </keep-alive>
              </v-fade-transition>
            </router-view>
          </v-window>
        </v-card>
      </v-main>
    </v-layout>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ref} from 'vue'
import {getTask} from "@/views/myprocess/list/task/helper";
import {useI18n} from "vue-i18n";
import {taskComments, taskCreateComment, taskSubmitForm} from "@/service";
import {useLoading} from "@/hooks";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {getUserInfo} from "@/store/auth/helpers";
import FormPreview from "@/views/form/design/preview";
import {getVariables} from "@/views/myprocess/helper";

const {t} = useI18n()
const {currentRoute} = useRouter()
const taskId = ref(currentRoute.value.params['id'] as string)

const {fetch, t: task, deployedForm} = getTask()
const processDef = computed<ApiFlowManagement.ProcessDefinition | undefined>(() => {
  const process = task.value?._embedded.processDefinition
  if (process && process.length > 0) {
    return process[0]
  }
  return undefined
})


const {push} = useRouter()
const v$ = useVuelidate()
const submit = async () => {
  const variables = {}
  v$.value.$validate().then(async valid => {
    if (valid) {
      getVariables(variables, deployedForm.value?.components)
      const {error} = await taskSubmitForm(taskId.value, variables)
      if (!error) {
        window.$snackBar?.success("success complete")
        await push('/my-process/list')
      }
    }
  })
}
const {loading: commentLoading} = useLoading()
const comments = ref<ApiFlowManagement.Comment[]>([])
const comment = ref('')
const commentLayout = ref(true)
const commentV$ = useVuelidate({
  comment: {
    required
  }
}, {comment}, {$scope: false})
const u = getUserInfo()
const leavecomment = async () => {
  commentV$.value.$validate().then(async valid => {
    if (valid) {
      commentLoading.value = true
      await taskCreateComment(taskId.value, {
        message: comment.value,
        userId: u.userId
      })
      commentLoading.value = false
      commentV$.value.$reset()
      comment.value = ''
      loadTaskComments()
    }
  })
}
const loadTaskComments = () => {
  taskComments(taskId.value).then(({data}) => {
    if (data) {
      comments.value = data
    }
  })
}

const init = async () => {
  await fetch(taskId.value)
  loadTaskComments()
}
init()


</script>

<style scoped>
.comment-item {
  .user::after {
    content: ':';
    padding: 0 3px;
  }
}
</style>
