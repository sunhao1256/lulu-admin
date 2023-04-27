export const routeModel: Record<Auth.RoleType, AuthRoute.Route[]> = {
  admin: [
    {
      name: 'dashboard',
      path: '/dashboard',
      component: 'basic',
      children: [
        {
          name: 'dashboard_analytics',
          path: '/dashboard/analytics',
          component: 'self',
          meta: {
            icon: 'mdi-view-dashboard-outline',
            title: 'menu.dashboard',
            requiresAuth: true
          }
        }
      ],
      meta: {
        title: 'menu.dashboard',
        icon: 'mdi-view-dashboard-outline',
        order: 1,
        requiresAuth: true
      }
    },
    {
      name: 'apps',
      path: '/apps',
      component: 'basic',
      children: [
        {
          name: 'apps_manager-user',
          path: '/apps/manager-user',
          component: 'blank',
          children: [
            {
              name: 'apps_manager-user_list',
              path: '/apps/manager-user/list',
              component: 'self',
              meta: {
                title: 'menu.usersList',
                requiresAuth: true
              }
            },
            {
              name: 'apps_manager-user_edit',
              path: '/apps/manager-user/edit',
              component: 'self',
              meta: {
                title: 'menu.usersEdit',
                dynamicPath: '/apps/manager-user/edit/:id?',
                requiresAuth: true
              }
            }
          ],
          meta: {
            title: 'menu.users',
            icon: 'mdi-account-multiple-outline',
            requiresAuth: true,
            order: 2,
          }
        },
        {
          name: 'apps_board',
          path: '/apps/board',
          component: 'self',
          meta: {
            title: 'menu.board',
            icon: 'mdi-view-column-outline',
            order: 1,
            requiresAuth: true,
          }
        },
        {
          name: 'apps_todo',
          path: '/apps/todo',
          component: 'todo',
          children: [
            {
              name: 'apps_todo_tasks',
              path: '/apps/todo/tasks',
              component: 'self',
              meta: {
                title: 'todo.tasks',
                requiresAuth: true,
                hide: true,
              }

            },
            {
              name: 'apps_todo_completed',
              path: '/apps/todo/completed',
              component: 'self',
              meta: {
                title: 'todo.completed',
                requiresAuth: true,
                hide: true,
              }
            },
            {
              name: 'apps_todo_label',
              path: '/apps/todo/label',
              component: 'self',
              meta: {
                title: 'todo.labels',
                hide: true,
                requiresAuth: true,
                dynamicPath: '/apps/todo/label/:id'
              }

            }
          ],
          meta: {
            title: 'menu.todo',
            icon: 'mdi-format-list-checkbox',
            requiresAuth: true,
            order: 1
          }
        },
        {
          name: "apps_chat",
          path: "/apps/chat",
          component: "chat",
          children: [
            {
              name: 'apps_chat-channel',
              path: '/apps/chat-channel',
              component: 'self',
              meta: {
                title: 'menu.chat-channel',
                dynamicPath: '/apps/chat-channel/:id?',
                requiresAuth: true,
                hide: true
              }
            }
          ],
          meta: {
            title: "menu.chat",
            order: 1,
            requiresAuth: true,
            icon: "mdi-forum-outline"
          }
        }
      ],
      meta: {
        title: 'menu.apps',
        requiresAuth: true,
      }
    },
    {
      name: 'other',
      path: '/other',
      component: 'basic',
      meta: {
        requiresAuth: true,
        title: 'menu.others'
      },
      children: [
        {
          name: 'blank-page',
          path: '/blank-page',
          component: 'blank',
          meta: {
            requiresAuth: true,
            title: 'menu.blank',
            icon: 'mdi-file-outline',
          }
        },
        {
          name: 'other_menu-levels',
          component: 'blank',
          path: '/other/menu-levels',
          meta: {
            requiresAuth: true,
            title: 'menu.levels'
          },
          children: [
            {
              name: 'other_menu-levels-2-1',
              path: '/other/menu-levels-2-1',
              component: 'self',
              meta: {
                requiresAuth: true,
                title: 'menu.levels2-1'
              }
            },
            {
              name: 'other_menu-levels-2-2',
              path: '/other/menu-levels-2-2',
              component: 'blank',
              meta: {
                requiresAuth: true,
                title: 'menu.levels2-2',
              },
              children: [
                {
                  name: 'other_menu-levels-3-1',
                  path: '/other/menu-levels-3-1',
                  component: 'self',
                  meta: {
                    requiresAuth: true,
                    title: 'menu.levels3-1'
                  }
                },
                {
                  name: 'other_menu-levels-3-2',
                  path: '/other/menu-levels-3-2',
                  component: 'self',
                  meta: {
                    requiresAuth: true,
                    title: 'menu.levels3-2'
                  }
                }
              ]
            }
          ]
        },

      ]
    },


    {
      name: "flowable",
      path: "/flowable",
      component: 'basic',
      redirect: '/flowable/processes/list',
      children: [
        {
          name: 'flowable_design',
          path: '/flowable/design',
          component: 'self',
          meta: {
            requiresAuth: true,
            dynamicPath: '/flowable/design/:id?',
            hide: true,
            title: 'menu.flowable-design',
          }
        },
        {
          name: 'flowable_process-definition',
          path: '/flowable/process-definition',
          component: 'self',
          meta: {
            requiresAuth: true,
            title: 'menu.flowable-process-definition',
            hide: true,
          },
          children: [
            {
              name: 'flowable_process-definition_process-instance',
              path: '/flowable/process-definition/process-instance',
              component: 'self',
              meta: {
                requiresAuth: true,
                dynamicPath: '/flowable/process-definition/:id/process-instance',
                title: 'menu.flowable-process-definition-process-instance',
              }
            },
            {
              name: 'flowable_process-definition_incident',
              path: '/flowable/process-definition/incident',
              component: 'self',
              meta: {
                requiresAuth: true,
                dynamicPath: '/flowable/process-definition/:id/incident',
                title: 'menu.flowable-process-definition-incident',
              }
            }
          ]
        },
        {
          name: 'flowable_processes',
          path: '/flowable/processes',
          component: 'self',
          meta: {
            requiresAuth: true,
            title: 'menu.flowable-list',
          },
          children: [
            {
              name: 'flowable_processes_list',
              path: '/flowable/processes/list',
              component: 'self',
              meta: {
                requiresAuth: true,
                title: 'menu.flowable-processes-list',
                hide: true
              }
            },
            {
              name: 'flowable_processes_preview',
              path: '/flowable/processes/preview',
              component: 'self',
              meta: {
                requiresAuth: true,
                title: 'menu.flowable-processes-preview',
                hide: true
              }
            }
          ]
        },

        {
          name: 'form_list',
          path: '/form/list',
          component: 'self',
          meta: {
            requiresAuth: true,
            title: 'menu.form-list',
          }
        },
        {
          name: 'form_design',
          path: '/form/design',
          component: 'self',
          meta: {
            requiresAuth: true,
            title: 'menu.form-design',
            dynamicPath: '/form/design/:id?'
          }
        },
      ],
      meta: {
        title: "menu.flowable",
        requiresAuth: true,
        icon: "mdi-waves-arrow-right"
      }
    },

  ],
  user: [
    {
      name: 'dashboard',
      path: '/dashboard',
      component: 'basic',
      children: [
        {
          name: 'dashboard_analytics',
          path: '/dashboard/analytics',
          component: 'self',
          meta: {
            icon: 'mdi-view-dashboard-outline',
            title: 'menu.dashboard',
            requiresAuth: true
          }
        }
      ],
      meta: {
        title: 'menu.dashboard',
        icon: 'mdi-view-dashboard-outline',
        order: 1,
        requiresAuth: true
      }
    },
  ]
};
