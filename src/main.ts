import * as core from '@actions/core'
import { Inputs } from './constants'
import { installCertification } from './security'

export async function run(): Promise<void> {
  try {
    const certificateBase64 = core.getInput(Inputs.CERTIFICATE_BASE64)
    const provisionProfileBase64 = core.getInput(
      Inputs.PROVISION_PROFILE_BASE64
    )
    const p12Password = core.getInput(Inputs.P12_PASSWORD)
    const keychainPassword = core.getInput(Inputs.KEYCHAIN_PASSWORD)
    // Validate Certificate Input
    if (!certificateBase64) {
      throw new Error('Certificate base64 is required')
    }
    // Validate Provision Profile Input
    if (!provisionProfileBase64) {
      throw new Error('Provision profile base64 is required')
    }
    // Validate Certificate Password
    if (!p12Password) {
      throw new Error('P12 password is required')
    }
    // Validate Keychain Password
    if (!keychainPassword) {
      throw new Error('Keychain password is required')
    }
    await installCertification({
      certificateBase64,
      provisionProfileBase64,
      p12Password,
      keychainPassword
    })
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
  }
}
