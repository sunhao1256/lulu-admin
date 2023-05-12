import {defineComponent, toRefs} from 'vue'
import {
  VTextField,
  VChip, VBtn, VCheckbox, VTextarea, VSwitch, VSelect, VFileInput,
  VRadioGroup,
  VRadio,
  VCol
} from 'vuetify/components'

import {PropType} from "vue";
import Formitem from "@/views/form/design/components/formitem";
import {VForm} from "vuetify/components/VForm";
import {cloneDeep} from "lodash-es";
import {VRow} from "vuetify/components/VGrid";
import {uniqueId} from "@/utils";
import {Validation} from "@vuelidate/core";
import {ValidateEach as EachValidate} from '@vuelidate/components'
import {helpers} from "@vuelidate/validators";

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
    },
    modelValue: null,
    v$: {
      type: Object as PropType<Validation>,
      required: false
    },
    index: {
      type: Number,
      required: true
    },
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
    'update:modelValue': (e) => e
  },
  setup(props, {emit}) {
    const {active, item} = toRefs(props)
    const zIndexStyle = 'z-index: ' + props.layers * 10
    const modelValue = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })

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
        return <div class={['d-flex', 'flex-row', 'align-center', 'flex-raw']}>
          {item.config.formChildren.map((c: formComponent, index) => {
            return <Formitem
              preview={true}
              index={index}
              item={c}></Formitem>
          })}
        </div>
      }

      return <VForm style={zIndexStyle}>
        <draggable itemKey={'id'}
                   animation={340}
                   group={"formComponentGroups"}
                   ghostClass={"ghost"}
                   class={["d-flex", 'flex-row', 'align-center']}
                   style={'min-height:60px'}
                   list={item.config.formChildren}>
          {{
            default: () => <VRow></VRow>,
            item: ({element, index}: { element: formComponent, index }) =>
              <Formitem active={props.active}
                        list={item.config.formChildren}
                        onDelete={(e: formComponent) => emitDelete(e)}
                        onDuplicate={(e: formComponent) => emitDuplicate(e)}
                        v-model={element.modelValue}
                        onSelected={(e: formComponent) => emitSelected(e)}
                        preview={props.preview}
                        idPrefix={props.idPrefix}
                        index={index}
                        layers={props.layers + 1}
                        v$={props.v$}
                        item={element}></Formitem>

          }}
        </draggable>
      </VForm>
    }

    const switchRender = (item: formComponent) => {
      switch (item.type) {
        case "button":
          return <VBtn color={item.config.color} density={item.config.density} class={'text-white'}>{item.name}</VBtn>
        case "checkbox":
          return <>{item.config.options.map((o: formOption) => {
            return <VCheckbox label={o.label} density={item.config.density}
                              hideDetails={!props.preview}
                              class={['d-inline-block']}></VCheckbox>
          })}</>
        case "switch":
          return <VSwitch hideDetails={!props.preview}
                          label={item.name} density={item.config.density}></VSwitch>
        case "textField":
          return <VTextField label={item.name} density={item.config.density} hideDetails={!props.preview}
                             variant={item.config.variant}></VTextField>
        case "textArea":
          return <VTextarea label={item.name} density={item.config.density} hideDetails={!props.preview}
                            variant={item.config.variant}></VTextarea>
        case "date":
          return <VTextField label={item.name} density={item.config.density} type={'date'} hideDetails={!props.preview}
                             variant={item.config.variant}></VTextField>
        case "datetime":
          return <VTextField label={item.name} density={item.config.density} type={'datetime-local'}
                             hideDetails={!props.preview}
                             variant={item.config.variant}></VTextField>
        case "time":
          return <VTextField label={item.name} density={item.config.density} type={'time'} hideDetails={!props.preview}
                             variant={item.config.variant}></VTextField>
        case "number":
          return <VTextField label={item.name} density={item.config.density} type={'number'}
                             hideDetails={!props.preview}
                             variant={item.config.variant}></VTextField>
        case "select":
          return <VSelect label={item.name} items={item.config.options}
                          itemTitle={'label'}
                          v-model={modelValue.value}
                          hideDetails={!props.preview}
                          itemValue={'value'} density={item.config.density}
                          variant={item.config.variant}></VSelect>
        case "user":
          return <VSelect label={item.name} items={['Lulu', 'frank', 'jack', 'joma', 'wang']}
                          itemTitle={'label'}
                          hideDetails={!props.preview}
                          itemValue={'value'} density={item.config.density}
                          variant={item.config.variant}></VSelect>
        case "role":
          return <VSelect label={item.name}
                          items={['admin', 'tester', 'developer', 'frontend', 'backend']}
                          itemTitle={'label'}
                          hideDetails={!props.preview}
                          itemValue={'value'} density={item.config.density}
                          variant={item.config.variant}></VSelect>
        case "upload":
          return <VFileInput label={item.name} prependIcon={''} prependInnerIcon={'mdi-paperclip'}
                             variant={item.config.variant}
                             chips
                             hideDetails={!props.preview}
                             density={item.config.density}
                             multiple={true}></VFileInput>
        case "radio":
          return <VRadioGroup label={item.name} density={item.config.density} hideDetails={!props.preview}
          >{item.config.options.map((o: formOption) => {
            return <VRadio label={o.label} value={o.value}></VRadio>
          })}</VRadioGroup>

        case "flexRow":
          return flexRawRender(item)
        default:
          return <span></span>
      }
    }

    const configRender = (item: formComponent, v) => {
      const element: JSX.Element = switchRender(item)
      if (props.preview && element.props) {
        element.props['errorMessages'] = v.modelValue.$errors.map(e => e.$message)
        if (item.config.defaultValue)
          element.props['modelValue'] = item.config.defaultValue
        element.props['readonly'] = item.config.readonly
        element.props['onUpdate:modelValue'] = (e) => {
          item.modelValue = e
        }
        element.props['onInput'] = (e) => {
          v.modelValue.$touch()
        }
        element.props['onBlur'] = (e) => {
          v.modelValue.$touch()
        }
      }
      return element
    }

    const modelRequired = (value, siblings: formComponent) => {
      if (siblings.config.required) {
        return helpers.req(value)
      }
      return true
    }
    const rules = {
      modelValue: {
        modelRequired: helpers.withMessage(
          (e) => {
            return 'value is required'
          },
          {
            $validator: modelRequired,
          },
        )
      }
    }

    return () =>
      <VCol class={'pa-0 d-flex flex-row align-center h-100'} cols={item.value.config.cols}>
        <div
          class={['form-item rounded flex-grow-1',
            active.value?.id === item.value.id && 'form-item-active',
            !props.preview && 'cursor-move px-1 py-1'
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
          <EachValidate rules={rules} state={item}>
            {({v}) => configRender(item.value, v)}
          </EachValidate>
        </div>
      </VCol>
  }
})


