export const getVariables = (variables, components?: formComponent[]) => {
  if (!components)
    return
  if (components.length > 0)
    components.forEach(i => {
      if (i.id && i.type != 'flexRow')
        variables[i.id] = {
          value: i.modelValue,
        }
      if (i.config.formChildren) {
        getVariables(variables, i.config.formChildren)
      }
    })
}

