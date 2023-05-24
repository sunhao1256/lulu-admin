<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">{{ t('menu.my-process-start-process-start') }}</div>
        <breadcrumb/>
      </div>
      <v-spacer/>
    </div>
    <v-row justify="center">
      <v-col sm="12" md="8" lg="8">
        <form-preview :components="form.components" :form="{id:form.id}" :v$="v$">
          <template #actions>
            <v-btn color="primary" variant="tonal" @click="submit">submit</v-btn>
          </template>
        </form-preview>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ref, reactive} from "vue";
import {processDefinitionDeployedStartForm, processDefinitionStartForm, processDefinitionSubmitForm} from "@/service";
import {useI18n} from "vue-i18n";
import FormPreview from "@/views/form/design/preview";
import useVuelidate from "@vuelidate/core";
import {getVariables} from "@/views/myprocess/helper";

const {t} = useI18n()
const {currentRoute} = useRouter()
const processDefinitionId = ref(currentRoute.value.params['pdId'] as string)
const form = reactive<ApiFlowManagement.deployedForm>({id: '', components: []})
const v$ = useVuelidate()
const getStartForm = async () => {
  const {data} = await processDefinitionStartForm(processDefinitionId.value)
  if (data && data.camundaFormRef) {
    form.id = data.camundaFormRef.key
    const {data: formData} = await processDefinitionDeployedStartForm(processDefinitionId.value)
    if (formData) {
      form.components = formData.components
    }
  }
}


const {push} = useRouter()
const submit = () => {
  const variables = {}
  v$.value.$validate().then(async (valid) => {
    if (valid) {
      const dialog = window.$dialog?.show({
        main: 'Confirm Start Process?',
        confirm: async () => {
          dialog?.confirmLoading(true)
          getVariables(variables, form.components)
          const {data} = await processDefinitionSubmitForm(processDefinitionId.value, variables)
          if (data) {
            window.$snackBar?.success('Started Process ' + processDefinitionId.value)
            await push('/my-process/list')
          }
          dialog?.close()
        }
      })
    }
  })
}

getStartForm()


window.$snackBar?.success(processDefinitionId.value)
</script>

<style scoped>

</style>
