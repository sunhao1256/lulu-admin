import {defineComponent, PropType} from 'vue'
import {VChip} from 'vuetify/components'

export default defineComponent({
  props: {
    variable: {
      required: true,
      type: Object as PropType<ApiFlowManagement.VariableInstance>
    }
  },
  setup(props) {
    const {variable} = props

    const render = () => {
      switch (variable.type) {
        case "File":
          return <VChip color={'primary'} size={'small'}>
            {variable.valueInfo.filename}
          </VChip>
        case "Object":
          return <VChip color={'primary'} size={'small'}>
            {variable.valueInfo.objectTypeName}
          </VChip>
        default:
          return <>{variable.value}</>
      }
    }

    return () => <div>
      {render()}
    </div>
  }
})
