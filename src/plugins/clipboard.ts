export function clipboard(text: string, toastText = 'Copied to Clipboard') {
  try {
    navigator.clipboard.writeText(text).then(() => {
      window.$snackBar?.info(toastText)
    })
  }catch (e) {
    window.$snackBar?.error("Copied to Clipboard failed!")
  }
}
