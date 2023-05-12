import {defineComponent, PropType} from 'vue'
import {VAlert, VAlertTitle, VCard, VChip, VHover, VSpacer} from "vuetify/components";
import Viewer from "@/views/flowable/components/viewer";
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
    const {push} = useRouter()
    const toDetail = async () => {
      await push({path: `/flowable/process-definition/${processResult.latestId}/process-instance`})
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
                <Viewer processDefinitionId={processResult.latestId}></Viewer>
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
