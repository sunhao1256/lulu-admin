interface formComponentGroup {
  name: string,
  children: formComponent[]
}

interface formComponent {
  [key: string]: any,

  id?: string,
  name: string,
  value: string,
  modelValue?: any,
  type: 'textField' | 'number' | 'switch' | 'button' | 'textArea' | 'select' | 'datetime' | 'date' | 'time' | 'checkbox' | 'upload' | 'user' | 'role' | 'flexRow' | 'radio'
  config: formComponentConfig
}

type formComponentConfig =
  Record<string, any>
  |
  (
    VSelect
    & VTextField
    & VBtn
    & VCheckbox
    & VRadio
    & VCol
    & {
    options: formOption[],
    formChildren: formComponent[]
  }
    & {
    required: boolean
    defaultValue: {
      value: string,
      expression: boolean,
    }
  }
    )


interface formOption {
  label?: string,
  value?: string
}

type formComponentType = NonNullable<formComponent['type']>


interface form {
  id: string,
  name?: string,
}
