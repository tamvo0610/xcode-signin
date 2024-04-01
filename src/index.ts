import * as core from '@actions/core'
import { run } from './main'
import { Inputs, States } from './constants'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()

const init = () => {
  getInputs()
}

const getInputs = () => {
  const certificateBase64 = core.getInput(Inputs.CERTIFICATE_BASE64)
  const provisionProfileBase64 = core.getInput(Inputs.PROVISION_PROFILE_BASE64)
  const p12Password = core.getInput(Inputs.P12_PASSWORD)
  const keychainPassword = core.getInput(Inputs.KEYCHAIN_PASSWORD)
  core.saveState(States.CERTIFICATE_BASE64, certificateBase64)
  core.saveState(States.PROVISION_PROFILE_BASE64, provisionProfileBase64)
  core.saveState(States.P12_PASSWORD, p12Password)
  core.saveState(States.KEYCHAIN_PASSWORD, keychainPassword)
}

const getVarialbe = () => {}

init()
