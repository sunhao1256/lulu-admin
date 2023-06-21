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
    'name': string,
    'enableDuplicateFilter': boolean,
    'source': string,
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

  namespace ProcessDefinitionGroup {
    interface ProcessDefinition {
      id: string
      createBy: string
      modifyBy: string
      createTime: string
      modifyTime: string
      groupId: string
      processDefinitionId: string
      processDefinitionKey: string
      processDefinitionName: string
      deployedTime: string
      deploymentId: string
    }
  }

  interface ProcessDefinitionGroup {
    id: string,
    name: string
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

  type CamundaFormRef = {
    key: string,
    binding: string,
    version: string,
  }

  interface FlowForm {
    key: string,
    contextPath: string,
    camundaFormRef: CamundaFormRef
  }

  interface deployedForm {
    id: string,
    components: formComponent[]
  }

  type FormDefinitionQuery = Pick<FormDefinition, "id" | "key"> & Sorting

  interface FormDefinition {
    id: string
    revision: number
    key: string
    version: number
    deploymentId: string
    resourceName: string
    tenantId: string
  }

  interface HalTaskList {
    count: number,
    _embedded: {
      processDefinition: ProcessDefinition[]
      task: Task[]
    }
  }

  type HalTask = {
    _embedded: {
      identityLink: IdentityLink[]
      processDefinition: ProcessDefinition[]
    }
  } & Task

  interface Task {
    id: string
    name: string
    assignee?: string
    created: string
    due?: string
    followUp: any
    lastUpdated: any
    delegationState: any
    description?: string
    executionId: string
    owner: any
    parentTaskId: any
    priority: number
    processDefinitionId: string
    processInstanceId: string
    taskDefinitionKey: string
    caseExecutionId: any
    caseInstanceId: any
    caseDefinitionId: any
    suspended: boolean
    formKey?: string
    camundaFormRef?: CamundaFormRef
    tenantId: any
  }

  type TaskQuery = {
    nameLike: string
    active: boolean
  } & Sorting & QueryParam

  type IdentityLink = {
    groupId: string,
    type: string,
    userId: string
  }

  type HistoricActInsQuery = {
    processInstanceId: string,
    finished: boolean
  } & Sorting

  interface HistoricActivityInstance {
    id: string
    parentActivityInstanceId: string
    activityId: string
    activityName: string
    activityType: string
    processDefinitionKey: string
    processDefinitionId: string
    processInstanceId: string
    executionId: string
    taskId: string
    calledProcessInstanceId: any
    calledCaseInstanceId: any
    assignee: any
    startTime: string
    endTime: any
    durationInMillis: any
    canceled: boolean
    completeScope: boolean
    tenantId: any
    removalTime: any
    rootProcessInstanceId: string
  }

  interface Comment {
    links: any[]
    id: string
    userId: string
    time: string
    taskId: string
    message: string
    removalTime: any
    rootProcessInstanceId: string
    processInstanceId: any
  }
}
