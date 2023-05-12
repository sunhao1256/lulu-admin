import {defineComponent, ref} from "vue";

import Viewer from "bpmn-js/lib/NavigatedViewer";
import {VCardText} from 'vuetify/components'
import {useLoading} from "@/hooks";
import {processDefinitionXml} from "@/service";
import {useThemeStore} from "@/store";
import {debounce} from "lodash-es";

export default defineComponent({
  name: 'viewer',
  props: {
    processDefinitionId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const {processDefinitionId} = props
    const viewerRef = ref<HTMLDivElement | null>(null)
    const {loading, startLoading, endLoading} = useLoading(true)
    const theme = useThemeStore()
    const xml = ref<string>()

    let viewer: any = null
    const centerElement = debounce(() => {
      if (!viewer)
        return
      const canvas = viewer.get('canvas')
      canvas.zoom('fit-viewport', 'auto');
    })
    const init = async () => {
      startLoading()
      const resp = await processDefinitionXml(processDefinitionId)
      endLoading()
      if (resp.data) {
        xml.value = resp.data.bpmn20Xml
      }
    }
    watch(() => theme.draw, () => {
      centerElement()
    })
    onMounted(async () => {
      try {
        await init()
        const viewerOptions = {
          container: viewerRef.value,
          canvas: {
            deferUpdate: false
          },
          additionalModules: [
            {moveCanvas: ['value', null]},
            {zoomScroll: ['value', null]},
          ]
        }
        await nextTick()
        viewer = new Viewer(viewerOptions)
        try {
          const {warnings} = await viewer!.importXML(xml.value)
          if (warnings && warnings.length) {
            warnings.forEach((warn: any) => console.warn(warn))
          }
        } catch (e) {
          console.error(`[Process Viewer Warn]: ${typeof e === 'string' ? e : (e as Error)?.message}`)
        }
        centerElement()
        window.addEventListener("resize", centerElement);
      } catch (e) {
        console.log(e)
      }
    })
    onUnmounted(() => {
      window.removeEventListener("resize", centerElement);
    })


    return () =>
      <>
        {
          !loading.value && (
            <>
              <VCardText class={'preview-item h-100'}>
                <div class={'h-100 w-100'} ref={viewerRef}></div>
              </VCardText>
            </>
          )
        }
      </>
  }
})
