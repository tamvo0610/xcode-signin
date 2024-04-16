import * as core from '@actions/core'
import { StateSingleton } from './utils/state.utils'

export async function run(): Promise<void> {
  try {
    const {
      CERTIFICATE_BASE64,
      P_PROFILE_BASE64,
      P12_PASSWORD,
      KEYCHAIN_PASSWORD
    } = StateSingleton.getInstance().initVariable()
    if (!CERTIFICATE_BASE64) {
      throw new Error('Certificate base64 is required')
    }
    if (!P_PROFILE_BASE64) {
      throw new Error('Provision profile base64 is required')
    }
    if (!P12_PASSWORD) {
      throw new Error('P12 password is required')
    }
    if (!KEYCHAIN_PASSWORD) {
      throw new Error('Keychain password is required')
    }
    await StateSingleton.getInstance().installCertificate()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
    process.exit(core.ExitCode.Failure)
  }
}

run()
