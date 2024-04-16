import * as core from '@actions/core'
import { StateSingleton } from './utils/state.utils'

export async function cleanKeyChain() {
  try {
    StateSingleton.getInstance().initVariable()
    StateSingleton.getInstance().cleanCertificate()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
  }
}
