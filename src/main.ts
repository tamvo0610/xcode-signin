import * as core from '@actions/core'
import { Inputs, States } from './constants'
import { installCertification } from './security'
import { getInputs, getVariables } from './utils/action.utils'

export async function run(): Promise<void> {
  try {
    getInputs()
    getVariables()
    await installCertification()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
  }
}
