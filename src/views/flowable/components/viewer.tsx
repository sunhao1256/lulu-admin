import {defineComponent, PropType, ref} from "vue";

import Viewer from "bpmn-js/lib/NavigatedViewer";
import {VCard, VAlert, VAlertTitle, VChip, VSpacer, VCardText, VHover} from 'vuetify/components'
import {useLoading} from "@/hooks";
import {processDefinitionXml} from "@/service";
import {useThemeStore} from "@/store";
import {debounce} from "lodash-es";
import {useRouter} from "vue-router";


export default defineComponent({
  props: {
    processResult: {
      type: Object as PropType<ProcessResult>,
      required: true,
    },
  },

  setup(props) {
    const {processResult} = props
    const viewerRef = ref<HTMLDivElement | null>(null)
    const {loading, startLoading, endLoading} = useLoading(true)
    const theme = useThemeStore()
    const xml = ref<String>()

    let viewer: any = null
    const centerElement = debounce(() => {
      if (!viewer)
        return
      const canvas = viewer.get('canvas')
      canvas.zoom('fit-viewport', 'auto');
    })
    const init = async () => {
      startLoading()
      const resp = await processDefinitionXml(processResult.latestId)
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

    const {push} = useRouter()

    const toDetail = async () => {
      await push({path: `/flowable/process-definition/${processResult.latestId}`})
    }

    return () =>
      <div class={'d-flex'}>
        <VHover>
          {({isHovering, props}) => (
            <div class={'d-flex flex-column'}>
              <VAlert text={processResult.name}></VAlert>
              <VCard {...props} elevation={!!isHovering ? 24 : 2}
                     {...{
                       'onClick': async () => {
                         await toDetail()
                       }
                     }}
              >
                {!loading.value && (
                  <>

                    <VCardText class={'preview-item h-100'}>
                      <div class={'h-100 w-100'} ref={viewerRef}></div>
                    </VCardText>
                  </>
                )}
              </VCard>
              <VAlert density={'comfortable'}>
                <VAlertTitle class={'text-caption'}>
                  {processResult.runningInstances + ' running Instances'}
                  <VSpacer/>
                  <VChip size={'small'} color={'green'} class={'front-weight-bold'} label>{'active'}</VChip>
                </VAlertTitle>
              </VAlert>
            </div>
          )}
        </VHover>
      </div>
  }
})
