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
  interface deployCreate {
    source: string,
    name: string,
    'deployment-file': File | undefined
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

  interface StatisticQuery {
    failedJobs: boolean,
    incidents: boolean,
    incidentsForType: string
  }

  interface QueryParam {
    firstResult: number,
    maxResults: number,
  }

  interface CockpitProcessInstanceQuery {
    sortBy: string,
    sortOrder: string,
    processDefinitionId: string
  }

  interface CockpitProcessInstance {
    id: string,
    businessKey: string,
    startTime: string,
    incidents: [],
    suspended: boolean,
  }

}
