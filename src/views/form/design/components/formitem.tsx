import {defineComponent, toRefs} from 'vue'
import {
  VTextField,
  VChip, VBtn, VCheckbox, VTextarea, VSwitch, VSelect, VFileInput,
  VRadioGroup,
  VRadio,
  VCol
} from 'vuetify/components'

import {PropType} from "vue";
import VueDraggable from 'vuedraggable'
import Formitem from "@/views/form/design/components/formitem";
import {VForm} from "vuetify/components/VForm";
import {cloneDeep, uniqueId} from "lodash-es";
import {VRow} from "vuetify/components/VGrid";

export default defineComponent({
  props: {
    item: {
      required: true,
      type: Object as PropType<formComponent>,
      default: () => {
      }
    },
    active: {
      required: false,
      type: Object as PropType<formComponent>,
      default: () => {
      }
    },
    layers: {
      required: false,
      type: Number,
      default: 0
    },
    list: {
      required: false,
      type: Array as PropType<Array<formComponent>>,
      default: () => []
    },
    idPrefix: {
      required: false,
      type: String,
      default: 'formComponent'
    },
    preview: {
      required: false,
      type: Boolean,
      default: false,
    }
  },
  emits: {
    'delete': (e: formComponent) => {
      return e
    },
    'selected': (e: formComponent) => {
      return e
    },
    'duplicate': (e: formComponent) => {
      return e
    },
  },
  setup(props, {emit}) {
    const {active, item} = toRefs(props)
    const zIndexStyle = 'z-index: ' + props.layers * 10

    const cloneComponent = (c: formComponent) => {
      const clone = cloneDeep(c)
      clone.id = props.idPrefix + '_' + uniqueId()
      recursiveIdGenerator(clone.config.formChildren)
      return clone
    }

    const recursiveIdGenerator = (list: formComponent[]) => {
      if (!list)
        return
      list.forEach(c => {
        c.id = props.idPrefix + '_' + uniqueId()
        if (c.config.formChildren) {
          recursiveIdGenerator(c.config.formChildren)
        }
      })
    }

    const deleteComponent = (list: formComponent[], c: formComponent) => {
      const index = list.findIndex(i => i.id == c.id)
      if (index > -1) {
        list.splice(index, 1)
      }
    }
    const duplicateComponent = (list: formComponent[], c: formComponent) => {
      const find = list.find(i => i.id == c.id)
      if (find) {
        const tmp = cloneComponent(find)
        list.splice(list.indexOf(find), 0, tmp)
      }
    }

    const emitSelected = (c: formComponent) => {
      emit('selected', c)
    }
    const emitDelete = (c: formComponent) => {
      emit('delete', c)
      deleteComponent(props.list, c)
    }
    const emitDuplicate = (c: formComponent) => {
      emit('duplicate', c)
      duplicateComponent(props.list, c)
    }


    const flexRawRender = (item: formComponent) => {
      // @ts-ignore

      if (props.preview) {
        return <div class={['d-flex', 'flex-row', 'align-center']}>
          {item.config.formChildren.map((c: formComponent) => {
            return <Formitem
              preview={true}
              item={c}></Formitem>
          })}
        </div>
      }

      return <VForm style={zIndexStyle}>

        <VueDraggable itemKey={'id'}
                      animation={340}
                      group={"formComponentGroups"}
                      ghostClass={"ghost"}
                      class={["d-flex", 'flex-row', 'align-center']}
                      style={'min-height:60px'}
                      list={item.config.formChildren}>
          {{
            default: () => <VRow></VRow>,
            item: ({element}: { element: formComponent }) =>
              <Formitem active={props.active}
                        list={item.config.formChildren}
                        onDelete={(e: formComponent) => emitDelete(e)}
                        onDuplicate={(e: formComponent) => emitDuplicate(e)}
                        onSelected={(e: formComponent) => emitSelected(e)}
                        layers={props.layers + 1}
                        item={element}></Formitem>

          }}
        </VueDraggable>
      </VForm>
    }

    const switchRender = (item: formComponent) => {
      switch (item.type) {
        case "button":
          return <VBtn color={item.config.color} density={item.config.density} class={'text-white'}>{item.name}</VBtn>
        case "checkbox":
          return <>{item.config.options.map((o: formOption) => {
            return <VCheckbox label={o.label} density={item.config.density} hideDetails={true}
                              class={['d-inline-block']}></VCheckbox>
          })}</>
        case "switch":
          return <VSwitch label={item.name} density={item.config.density}></VSwitch>
        case "textField":
          return <VTextField label={item.name} hideDetails={true} density={item.config.density}
                             variant={item.config.variant}></VTextField>
        case "textArea":
          return <VTextarea label={item.name} hideDetails={true} density={item.config.density}
                            variant={item.config.variant}></VTextarea>
        case "date":
          return <VTextField label={item.name} hideDetails={true} density={item.config.density} type={'date'}
                             variant={item.config.variant}></VTextField>
        case "time":
          return <VTextField label={item.name} hideDetails={true} density={item.config.density} type={'time'}
                             variant={item.config.variant}></VTextField>
        case "number":
          return <VTextField label={item.name} hideDetails={true} density={item.config.density} type={'number'}
                             variant={item.config.variant}></VTextField>
        case "select":
          return <VSelect label={item.name} hideDetails={true} items={item.config.options}
                          itemTitle={'label'}
                          itemValue={'value'} density={item.config.density}
                          variant={item.config.variant}></VSelect>
        case "user":
          return <VSelect label={item.name} hideDetails={true} items={['Lulu', 'frank', 'jack', 'joma', 'wang']}
                          itemTitle={'label'}
                          itemValue={'value'} density={item.config.density}
                          variant={item.config.variant}></VSelect>
        case "role":
          return <VSelect label={item.name} hideDetails={true}
                          items={['admin', 'tester', 'developer', 'frontend', 'backend']}
                          itemTitle={'label'}
                          itemValue={'value'} density={item.config.density}
                          variant={item.config.variant}></VSelect>
        case "upload":
          return <VFileInput label={item.name} hideDetails={true} prependIcon={''} prependInnerIcon={'mdi-paperclip'}
                             variant={item.config.variant}
                             chips
                             density={item.config.density}
                             multiple={true}></VFileInput>
        case "radio":

          return <VRadioGroup label={item.name} density={item.config.density}
                              hideDetails={true}>{item.config.options.map((o: formOption) => {
            return <VRadio label={o.label} value={o.value}></VRadio>
          })}</VRadioGroup>

        case "flexRow":
          return flexRawRender(item)
        default:
          return <span></span>
      }
    }

    return () =>
      <VCol class={'pa-0 d-flex flex-row align-center h-100'} cols={item.value.config.cols}>
        <div
          class={['py-1 form-item rounded flex-grow-1',
            active.value?.id === item.value.id && 'form-item-active',
            !props.preview && 'cursor-move px-1'
          ]}
          onClick={(event: any) => {
            event.stopPropagation()
            emitSelected(item.value)
          }}>
          {active.value?.id === item.value.id && !props.preview && <div class={'form-item-active-options'}>
            <VChip size={'small'} color={'primary'} variant={'elevated'}
                   onClick={() => emitDuplicate(item.value)}>duplicate</VChip>
            <VChip size={'small'} color={'error'} variant={'elevated'}
                   onClick={() => emitDelete(item.value)}>delete</VChip>
          </div>}
          {item.value.type === 'flexRow' && !props.preview &&
            <span class={'form-item-active-flex'}>FlexRow</span>
          }
          {switchRender(item.value)}
        </div>
      </VCol>
  }
})


