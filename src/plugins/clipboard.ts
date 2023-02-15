export function clipboard(text: string, toastText = 'Copied to Clipboard') {
  navigator.clipboard.writeText(text).then(() => {
    window.$snackBar?.info(toastText)
  })
}
