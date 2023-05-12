export * from './typeof';
export * from './pattern';

export const uniqueId = () => {
  return (+new Date).toString(36).slice(-10)
}
