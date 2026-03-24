import {defineComponent} from 'vue'
import {
  VTextField,
  VBtn,
  VSwitch,
  VColorPicker,
  VIcon,
  VSlider,
  VSelect
} from 'vuetify/components'

import {PropType} from "vue";

export default defineComponent({
  props: {
    'modelValue': {
      required: true,
      type: Object as PropType<formComponent>,
      default: () => {
      }
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {

    const optionsRender = (item: formComponent) => {
      return <div class={['d-flex flex-column']}>
        {item.config.options.map((o: formOption, index: number) => {
          return <div class={['d-flex flex-row position-relative']}>
            <VIcon {...{
              'onClick': () => {
                item.config.options.splice(index, 1)
              }
            }} class={'position-absolute cursor-pointer pa-1'} style={'right:-10px;top:-10px'} size={'small'}
                   color={'error'}
                   icon={"mdi-close-circle-outline"}></VIcon>
            <VTextField label={'label'} class={'mr-1'} variant={'outlined'}
                        density={'comfortable'} v-model={o.label}
            ></VTextField>
            <VTextField label={'value'} variant={'outlined'} density={'comfortable'} v-model={o.value}
            ></VTextField>
          </div>
        })}
        <VBtn color={'primary'} {...{
          'onClick': () => {
            item.config.options.push({})
          }
        }}>New Option</VBtn>
      </div>
    }

    const variantSelectRender = (item: formComponent) => {
      return <VSelect items={["filled", "outlined", "plain", "underlined", "solo"]}
                      density={'comfortable'}
                      variant={'outlined'}
                      label={'variant'}
                      v-model={item.config.variant}></VSelect>
    }
    const densitySelectRender = (item: formComponent) => {
      return <VSelect items={['default', 'comfortable', 'compact']}
                      density={'comfortable'}
                      variant={'outlined'}
                      label={'density'}
                      v-model={item.config.density}></VSelect>
    }

    const switchRender = (item: formComponent) => {
      switch (item.type) {
        case "button":
          return <VColorPicker v-model={item.config.color} mode={"hexa"}></VColorPicker>
        case "checkbox":
          return optionsRender(item)
        case "radio":
          return optionsRender(item)
        case "switch":
          return <VTextField label={item.name} hideDetails={true} variant={item.config.variant}></VTextField>
        case "textField":
          return [variantSelectRender(item)]
        case "textArea":
          return undefined
        case "date":
          return undefined
        case "time":
          return undefined
        case "number":
          return undefined
        case "select":
          return optionsRender(item)
        case "upload":
          return <VTextField type={'number'} variant={'outlined'} density={'comfortable'}
                             label={'MaxSize/MB'}></VTextField>

        default:
          return undefined
      }
    }

    return () =>
      <div>
        <VTextField variant={'outlined'} density={'comfortable'} label={"Id"} readonly={true}
                    v-model={props.modelValue.id}></VTextField>
        <VTextField variant={'outlined'} density={'comfortable'} label={"type"} readonly={true}
                    v-model={props.modelValue.type}></VTextField>
        <VTextField variant={'outlined'} density={'comfortable'} label={"name"}
                    v-model={props.modelValue.name}></VTextField>
        {densitySelectRender(props.modelValue)}
        <VSlider thumbLabel={'always'} v-model={props.modelValue.config.cols} max={12} min={0} step={1}
                 color={'primary'}></VSlider>
        <VSwitch color={"primary"} label={"required"}></VSwitch>
        {switchRender(props.modelValue)}
      </div>

  }
})


