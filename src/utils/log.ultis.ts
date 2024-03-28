import * as core from '@actions/core'

export const Log = {
  info: (str: string) => {
    core.info(`===== INFO: ${str}`)
    return `===== INFO: ${str}`
  },
  error: (str: string) => {
    core.error(`===== ERROR: ${str}`)
    return `===== ERROR: ${str}`
  },
  notice: (str: string) => {
    core.notice(`===== NOTICE: ${str}`)
    return `===== NOTICE: ${str}`
  },
  warning: (str: string) => {
    core.warning(`===== WARNING: ${str}`)
    return `===== WARNING: ${str}`
  }
}
