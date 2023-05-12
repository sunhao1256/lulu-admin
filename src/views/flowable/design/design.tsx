import {defineComponent, ref, toRefs, nextTick} from 'vue'
import type {PropType} from 'vue'
import customTranslate from "./customTranslate";
import initModeler from './initModeler'
import {default as camundaModdleDescriptor} from 'camunda-bpmn-moddle/resources/camunda.json';
import {createNewDiagram} from './util'

const Designer = defineComponent({
  name: 'Designer',
  props: {
    xml: {
      type: String as PropType<string>,
      default: undefined
    }
  },
  emits: ['update:xml', 'command-stack-changed'],
  setup(props, {emit, slots}) {
    const {xml} = toRefs(props)
    const designer = ref<HTMLDivElement | null>(null)
    const {current} = useTheme()
    onMounted(async () => {
      try {
        await nextTick()
        const editorSettings = {
          container: designer.value,
          bpmnRenderer: {
            defaultLabelColor: current.value.colors.primary,
          },
          keyboard: {
            bindTo: document,
          },
          additionalModules: [
            {
              translate: ['value', customTranslate]
            },
          ],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        }
        initModeler(editorSettings, emit)
        await createNewDiagram(xml.value, editorSettings)
      } catch (e) {
        console.log(e)
      }
    })

    return () => <div ref={designer} class="canvas rounded" id="js-canvas">{slots.right?.()}</div>
  }
})

export default Designer

