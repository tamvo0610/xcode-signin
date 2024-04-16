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
  core.exportVariable(States.CERTIFICATE_BASE64, certificateBase64)
  core.exportVariable(States.PROVISION_PROFILE_BASE64, provisionProfileBase64)
  core.exportVariable(States.P12_PASSWORD, p12Password)
  core.exportVariable(States.KEYCHAIN_PASSWORD, keychainPassword)
}

export const getVariables = () => {
  const RUNNER_TEMP = process.env['RUNNER_TEMP'] || process.cwd()
  const CERTIFICATE_PATH = path.join(RUNNER_TEMP, 'build_certificate.p12')
  const P_PROFILE_PATH = path.join(RUNNER_TEMP, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(RUNNER_TEMP, 'app-signing.keychain-db')
  core.exportVariable(States.RUNNER_TEMP_PATH, RUNNER_TEMP)
  core.exportVariable(States.CERTIFICATE_PATH, CERTIFICATE_PATH)
  core.exportVariable(States.PROVISION_PROFILE_PATH, P_PROFILE_PATH)
  core.exportVariable(States.KEYCHAIN_PATH, KEYCHAIN_PATH)
}
