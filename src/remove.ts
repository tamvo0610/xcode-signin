import * as core from '@actions/core'
import { cleanKeychainAndProvision } from './security'

export async function cleanKeyChain() {
  try {
    await cleanKeychainAndProvision()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
  }
}
