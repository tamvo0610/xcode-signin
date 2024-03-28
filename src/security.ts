import * as exec from '@actions/exec'
import path from 'path'
import { Log } from './utils/log.ultis'

interface VariableData {
  runnerTemp: string
  certificatePath: string
  ppPath: string
  keychainPath: string
}

interface InputsData {
  certificateBase64: string
  provisionProfileBase64: string
  p12Password: string
  keychainPassword: string
}

export async function installCertification(inputs: InputsData) {
  const RUNNER_TEMP = process.env['RUNNER_TEMP'] || process.cwd()
  Log.info(`RUNNER_TEMP ${RUNNER_TEMP}`)
  const variable = createVariable(inputs, RUNNER_TEMP)
  await createKeychain(variable, inputs)
  await setKeychainSettings(variable)
  await unlockKeychain(variable, inputs)
  // await importCertFromSecret(variable, inputs)
  // await importCertToKeychain(variable, inputs)
  // await apllyProvision(variable)
}

export const createVariable = (inputs: InputsData, runnerTemp: string) => {
  const CERTIFICATE_PATH = path.join(runnerTemp, 'build_certificate.p12')
  const PP_PATH = path.join(runnerTemp, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(runnerTemp, 'app-signing.keychain')
  return {
    runnerTemp: runnerTemp,
    certificatePath: CERTIFICATE_PATH,
    ppPath: PP_PATH,
    keychainPath: KEYCHAIN_PATH
  }
}

export const importCertFromSecret = async (
  data: VariableData,
  inputs: InputsData
) => {
  const { runnerTemp, certificatePath } = data
  Log.info('Import Certificate From Secret')
  await exec.exec(
    `echo -n ${inputs.certificateBase64} | base64 --decode -o ${data.certificatePath}`
  )
  await exec.exec(
    `echo -n ${inputs.provisionProfileBase64} | base64 --decode -o ${data.ppPath}`
  )
}

export const createKeychain = async (
  data: VariableData,
  inputs: InputsData
) => {
  const { keychainPath } = data
  const { keychainPassword } = inputs
  Log.info('Create Keychain')
  const args = ['create-keychain', '-p', keychainPassword, keychainPath]
  await exec.exec('security', args)
}

const setKeychainSettings = async (data: VariableData) => {
  const { keychainPath } = data
  Log.info('Set Keychain Settings')
  const args = ['set-keychain-settings', '-lut', '21600', keychainPath]
  await exec.exec('security', args)
}

const unlockKeychain = async (data: VariableData, inputs: InputsData) => {
  const { keychainPath } = data
  const { keychainPassword } = inputs
  Log.info('Unlock Keychain')
  const args = ['unlock-keychain', '-p', keychainPassword, keychainPath]
  await exec.exec('security', args)
}

export const importCertToKeychain = async (
  data: VariableData,
  inputs: InputsData
) => {
  const { keychainPath, certificatePath } = data
  const { keychainPassword, p12Password } = inputs
  // await exec.exec(
  //   `security import ${certificatePath} -P ${p12Password} -A -t cert -f pkcs12 -k ${keychainPath}`
  // )
  // await exec.exec(
  //   `security set-key-partition-list -S apple-tool:,apple: -k ${keychainPassword} ${keychainPath}`
  // )
  // await exec.exec(`security list-keychain -d user -s ${keychainPath}`)
}

export const apllyProvision = async (data: VariableData) => {
  const { ppPath } = data
  // await exec.exec('mkdir -p ~/Library/MobileDevice/Provisioning Profiles')
  // await exec.exec(`cp ${ppPath} ~/Library/MobileDevice/Provisioning\ Profiles`)
}

export const cleanKeychainAndProvision = () => {
  // security delete-keychain $RUNNER_TEMP/app-signing.keychain-db
  // rm ~/Library/MobileDevice/Provisioning\ Profiles/build_pp.mobileprovision
}
