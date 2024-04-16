import * as core from '@actions/core'
import { StateSingleton } from './utils/state.utils'
import { Log } from './utils/log.utils'

export async function cleanKeyChain() {
  try {
    Log.info('Clean Certificate')
    // await StateSingleton.getInstance().cleanCertificate()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
    process.exit(core.ExitCode.Failure)
  }
}
