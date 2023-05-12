import {defineComponent, PropType} from 'vue'
import {
  VCard, VCardText, VCardTitle
} from "vuetify/components";
import Formitem from "@/views/form/design/components/formitem";
import {Validation} from "@vuelidate/core";

export default defineComponent({
  name: 'formPreview',
  props: {
    form: {
      required: true,
      type: Object as PropType<form>,
    },
    components: {
      required: true,
      type: Array as PropType<formComponent[]>
    },
    v$: {
      type: Object as PropType<Validation>,
      required: false
    },
  },
  setup(props, {slots, emit}) {
    return () => <VCard>
      <VCardTitle>{props.form.name || props.form.id}
        {slots.title?.()}
      </VCardTitle>
      <VCardText>
        <form>
          {props.components.map((c, index) => {
            return <Formitem
              preview={true}
              v-model={c.modelValue}
              index={index}
              v$={props.v$}
              item={c}></Formitem>
          })}
          {slots.actions?.()}
        </form>
      </VCardText>
    </VCard>
  }
})
