import * as core from '@actions/core'
import { Inputs } from './constants'
import { installCertification } from './security'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputs = {
      certificateBase64: core.getInput(Inputs.CERTIFICATE_BASE64),
      provisionProfileBase64: core.getInput(Inputs.PROVISION_PROFILE_BASE64),
      p12Password: core.getInput(Inputs.P12_PASSWORD),
      keychainPassword: core.getInput(Inputs.KEYCHAIN_PASSWORD)
    }

    if (!inputs.certificateBase64) {
      throw new Error('Certificate base64 is required')
    }

    if (!inputs.provisionProfileBase64) {
      throw new Error('Provision profile base64 is required')
    }

    if (!inputs.p12Password) {
      throw new Error('P12 password is required')
    }

    if (!inputs.keychainPassword) {
      throw new Error('Keychain password is required')
    }

    await installCertification(inputs)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Action failed with error ${error}`)
    }
  }
}
