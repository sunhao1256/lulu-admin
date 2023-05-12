declare namespace ApiCommon {
  interface PageResult<T = any> {
    pageNo: number,
    pageSize: number,
    list: T,
    total: number,
  }
}

declare namespace ApiAuth {
  interface Token {
    token: string;
    refreshToken: string;
  }

  type UserInfo = Auth.UserInfo;
}

declare namespace ApiRoute {
  interface Route {
    routes: AuthRoute.Route[];
    home: AuthRoute.AllRouteKey;
  }
}

declare namespace ApiForm {
  interface Form {
    config: string;
    id: string;
    name: string;
    status: '1' | '0';
    created: string;
  }
}

declare namespace ApiUserManagement {

  interface Address {
    city?: string,
    state?: string,
    country?: string,
    zipCode?: string,
    detail?: string,
  }

  interface User {
    id: string,
    name: string,
    verified: boolean,
    created: string,
    lastSignIn: string,
    birthDay: string,
    gender: '0' | '1' | '2';
    phone: string;
    email: string;
    userStatus: '1' | '2' | '4';
    avatar: string
    address: Address
  }
}

declare namespace ApiChatManagement {
  interface message {
    id: string,
    text: string,
    timestamp: string,
    image?: string,
    user: {
      avatar: string,
      id: string
    }
  }
}

declare namespace ApiChatManagement {
  interface message {
    id: string,
    text: string,
    timestamp: string,
    image?: string,
    user: {
      avatar: string,
      id: string
    }
  }
}

declare namespace ApiChatManagement {
  interface message {
    id: string,
    text: string,
    timestamp: string,
    image?: string,
    user: {
      avatar: string,
      id: string
    }
  }
}


declare namespace ApiFlowManagement {

  type deployCreate = {
    'deployment-name': string,
    'enable-duplicate-filtering': boolean,
    'deployment-source': string,
  } & Record<string, any>

  type deployList = Partial<{
    'source': string,
    nameLike: string,
  }> & Partial<QueryParam> & Partial<Sorting>


  interface deployDeleteQuery {
    cascade: boolean,
    skipCustomListeners: boolean,
    skipIoMappings: boolean,
  }

  interface resource {
    id: string
    name: string
    deploymentId: string
  }

  interface deployment {
    id: string
    name?: string
    source: string
    deploymentTime: string
    tenantId: any
  }

  interface ProcessDefinition {
    id: string
    key: string
    category: string
    description: any
    name: any
    version: number
    resource: string
    deploymentId: string
    diagram: any
    suspended: boolean
    tenantId: any
    versionTag: any
    historyTimeToLive: any
    startableInTasklist: boolean
  }

  interface ProcessStatisticsResult extends StatisticsResult {
    definition: ProcessDefinition
  }

  interface StatisticsResult {
    id: string
    instances: number
    failedJobs: number
    incidents: any[]
  }

  interface ProcessDefinitionXmlResult {
    id: string,
    bpmn20Xml: string
  }

  interface ProcessDefinitionQueryCount {
    key: string,
    sortBy: string,
    sortOrder: string,
    withoutTenantId: boolean,
  }

  type ProcessDefinitionsQuery = {
    key: string,
    sortBy: string,
    sortOrder: string,
    withoutTenantId: boolean,
    latest: boolean,
    active: boolean,
    nameLike: string,
    startableInTasklist: boolean,
    startablePermissionCheck: true,
  } & QueryParam


  interface ProcessDefinitionSuspendedParam {
    executionDate: string,
    includeProcessInstances: boolean,
    suspended: boolean
  }

  interface StatisticQuery {
    failedJobs: boolean,
    incidents: boolean,
    incidentsForType: string
  }

  interface QueryParam {
    firstResult: number,
    maxResults: number,
    deserializeValues: boolean,
  }

  interface CockpitProcessInstanceQuery {
    sortBy: string,
    sortOrder: string,
    processDefinitionId: string,
    activityIdIn: string[]
  }

  interface CockpitProcessInstance {
    id: string,
    businessKey: string,
    startTime: string,
    incidents: [],
    suspended: boolean,
  }

  interface ProcessInstanceCountQuery {
    processDefinitionKey: string
    processDefinitionId: string
    processDefinitionWithoutTenantId: boolean
  }

  interface ActivityInstance {
    id: string
    parentActivityInstanceId: any
    activityId: string
    activityType: string
    processInstanceId: string
    processDefinitionId: string
    childActivityInstances: ActivityInstance[]
    childTransitionInstances: any[]
    executionIds: string[]
    activityName: string
    incidentIds: any[]
    incidents: any[]
    name: string
  }

  interface ProcessInstance {
    links: any[]
    id: string
    definitionId: string
    businessKey: any
    caseInstanceId: any
    ended: boolean
    suspended: boolean
    tenantId: any
  }

  interface VariableInstance {
    type: VariableType
    value: any
    valueInfo: Record<any, any>
    id: string
    name: string
    processDefinitionId: string
    processInstanceId: string
    executionId: string
    caseInstanceId: any
    caseExecutionId: any
    taskId: any
    batchId: any
    activityInstanceId: string
    errorMessage: any
    tenantId: any
  }

  type VariableType = 'Object' | 'File' | 'Double' | 'String'

  interface VariableInstanceQuery {
    processInstanceIdIn: string[]
    sorting: Sorting[]
  }

  interface Sorting {
    sortBy: string
    sortOrder: sortOrder
  }

  type sortOrder = 'asc' | 'desc'


  interface FlowForm {
    key: string,
    contextPath: string,
    camundaFormRef: {
      key: string,
      binding: string,
      version: string,
    }
  }

  interface deployedForm {
    id: string,
    components: formComponent[]
  }

}
