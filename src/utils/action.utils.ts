import * as core from '@actions/core'
import path from 'path'
import { Inputs, States } from 'src/constants'

export const getInputs = () => {
  const certificateBase64 = core.getInput(Inputs.CERTIFICATE_BASE64)
  const provisionProfileBase64 = core.getInput(Inputs.PROVISION_PROFILE_BASE64)
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
  core.saveState(States.CERTIFICATE_BASE64, certificateBase64)
  core.saveState(States.PROVISION_PROFILE_BASE64, provisionProfileBase64)
  core.saveState(States.P12_PASSWORD, p12Password)
  core.saveState(States.KEYCHAIN_PASSWORD, keychainPassword)
}

export const getVariables = () => {
  const RUNNER_TEMP = process.env['RUNNER_TEMP'] || process.cwd()
  const CERTIFICATE_PATH = path.join(RUNNER_TEMP, 'build_certificate.p12')
  const P_PROFILE_PATH = path.join(RUNNER_TEMP, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(RUNNER_TEMP, 'app-signing.keychain-db')
  core.saveState(States.RUNNER_TEMP_PATH, RUNNER_TEMP)
  core.saveState(States.CERTIFICATE_PATH, CERTIFICATE_PATH)
  core.saveState(States.PROVISION_PROFILE_PATH, P_PROFILE_PATH)
  core.saveState(States.KEYCHAIN_PATH, KEYCHAIN_PATH)
}
