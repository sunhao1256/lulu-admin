import {processDefinitionStatistics} from "@/service";
import {useLoading} from "@/hooks";
import {groupBy, sortBy} from "lodash-es";
import {ref} from 'vue'
import $ from "jquery";

export const loadListProcessResultStatistics = () => {

  const items = ref<ProcessResult[]>([])
  const {loading, startLoading, endLoading} = useLoading(true);
  const loadData = async () => {
    startLoading();
    const {data} = await processDefinitionStatistics();
    endLoading();
    if (data) {
      items.value = uniqueByDefinitionKey(data)
    }
  }
  return {
    loading,
    items,
    loadData
  }
}
const uniqueByDefinitionKey = (list: ApiFlowManagement.ProcessStatisticsResult[]): ProcessResult[] => {
  const groups = groupBy(list, (i: ApiFlowManagement.ProcessStatisticsResult) => i.definition.key)
  const arr = Object.keys(groups)
    .map(key => {
      const list = groups[key]
      const incidents = list.reduce((accumulate: number, current: ApiFlowManagement.ProcessStatisticsResult) => {
        return accumulate + current.incidents.length
      }, 0)
      const runningInstances = list.reduce((accumulate: number, current: ApiFlowManagement.ProcessStatisticsResult) => {
        return accumulate + current.instances
      }, 0)
      const processDefinitions = list.map(i => i.definition);
      processDefinitions.sort((p, a) => a.version - p.version)
      return {
        name: processDefinitions[0].name || processDefinitions[0].key,
        latestId: processDefinitions[0].id,
        incidents,
        runningInstances,
        processDefinitions,
      }
    })
  return sortBy(arr, [i => i.name], ['desc'])
}

export const fitAuto = (viewer) => {
  const canvas = viewer.get('canvas');
  // zoom to fit full viewport
  canvas.zoom('fit-viewport', 'auto');
}

export const InstanceCount = (viewer, statisticResults: ApiFlowManagement.StatisticsResult[] | undefined, f: (id: string | null) => void) => {
  // access viewer components
  const overlays = viewer.get('overlays');
  const canvas = viewer.get('canvas');
  const elementRegistry = viewer.get('elementRegistry');
  statisticResults?.forEach(r => {
    // attach an overlay to a node
    const node = htmlString2dom(`<div class="activity-bottom-left-position">
<span class="badge">${r.instances}</span>
</div>`)
    const element = elementRegistry.get(r.id)
    node.addEventListener("click", () => {
      f(element.id)
    })
    overlays.add(element, {
      position: {
        bottom: 0,
        left: 0
      },
      html: node,
    });
    canvas.addMarker(element, 'cursor-pointer');
  })

}


const ActivityHighlight = (viewer, elementId: string) => {
  // access viewer components
  const canvas = viewer.get('canvas');
  const elementRegistry = viewer.get('elementRegistry');
  const element = elementRegistry.get(elementId)
  canvas.addMarker(element, 'highlight');
  $('[data-element-id="' + element.id + '"]>.djs-outline').attr({
    rx: '14px',
    ry: '14px'
  });
}
const clearActivityHighlight = (viewer, elementId: string) => {
  // access viewer components
  const canvas = viewer.get('canvas');
  const elementRegistry = viewer.get('elementRegistry');
  const element = elementRegistry.get(elementId)
  canvas.removeMarker(element, 'highlight');
}

function htmlString2dom(html: string): HTMLHtmlElement {
  const placeholder = document.createElement("div");
  placeholder.innerHTML = html;
  return placeholder.firstElementChild as HTMLHtmlElement;
}


export const setupEventListener = (viewer, statisticResults: ApiFlowManagement.StatisticsResult[] | undefined,
                                   selection: string[],
                                   click: (id: string | null) => void) => {

  InstanceCount(viewer, statisticResults, click)
  const activeElement = Object.keys(groupBy(statisticResults, (s: ApiFlowManagement.StatisticsResult) => s.id))
  const eventBus = viewer.get('eventBus');
  const elementRegistry = viewer.get('elementRegistry');
  //initiation
  selection.splice(0, selection.length)
  otherOut({id: '-1'})
  eventBus.off('element.click')
  eventBus.on('element.click', (e) => {
    const isRoot = !e.element.parent;
    const element = e.element.businessObject
    if (
      !isRoot &&
      activeElement.indexOf(element.id) > -1 &&
      isElementSelectable(element)
    ) {
      selection[0] = (element.id)
      click(element.id)
    } else {
      selection.splice(0, selection.length)
      click(null)
    }
    otherOut(element)
  });
  eventBus.off('element.hover')
  eventBus.on('element.hover', (e) => {
    const element = e.element.businessObject
    onHover(element)
  });
  eventBus.off('element.out')
  eventBus.on('element.out', (e) => {
    const element = e.element.businessObject
    onOut(element)
  });

  function otherOut(element) {
    elementRegistry.filter(e => e.id != element.id).forEach(e => {
      onOut(e.businessObject)
    })
  }

  function onHover(element) {
    if (
      activeElement.indexOf(element.id) > -1 &&
      isElementSelectable(element)
    )
      ActivityHighlight(viewer, element.id)
  }

  function onOut(element) {
    if (
      activeElement.indexOf(element.id) > -1 &&
      isElementSelectable(element) &&
      selection.indexOf(element.id) == -1
    )
      clearActivityHighlight(viewer, element.id)
  }


}

const isElementSelectable = (element) => {
  return (
    element.isSelectable ||
    element.$instanceOf('bpmn:FlowNode')
  );
};
