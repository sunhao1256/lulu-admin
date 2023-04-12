import {defineComponent, computed, ref, PropType} from 'vue'
import {
  VDialog, VCard, VCardText, VCardTitle, VCardActions,
  VBtn
} from "vuetify/components";
import Formitem from "@/views/form/design/components/formitem";
import {VSpacer} from "vuetify/components/VGrid";

export default defineComponent({
  props: {
    'modelValue': {
      required: true,
      type: Boolean,
      default: () => {
      }
    },
    form: {
      required: true,
      type: Object as PropType<form>,
    },
    components: {
      required: true,
      type: Array as PropType<formComponent[]>
    }
  },
  setup(props, {emit}) {
    const m = ref<Boolean>(false)
    const model = computed({
      set(v: Boolean) {
        m.value = v
        emit('update:modelValue', v)
      },
      get() {
        return props.modelValue
      }
    })

    return () => <VDialog maxWidth={'600px'} v-model={model.value}>
      <VCard>
        <VCardTitle>{props.form.name || props.form.id}</VCardTitle>
        <VCardText>
          {props.components.map(c => {
            return <Formitem
              preview={true}
              item={c}></Formitem>
          })}
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn {...{onClick: () => model.value = false}} variant={'tonal'} color={'error'}>cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  }
})
