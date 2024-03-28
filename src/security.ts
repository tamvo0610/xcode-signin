import path from 'path'
import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'

interface VariableData {
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
  const runnerTemp = process.env['RUNNER_TEMP'] || process.cwd()
  const variable = createVariable(runnerTemp)
}

export const createVariable = (runnerTemp: string) => {
  const CERTIFICATE_PATH = path.join(runnerTemp, 'build_certificate.p12')
  const PP_PATH = path.join(runnerTemp, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(runnerTemp, 'app-signing.keychain-db')
  return {
    certificatePath: CERTIFICATE_PATH,
    ppPath: PP_PATH,
    keychainPath: KEYCHAIN_PATH
  }
}

export const importCertFromSecret = async (
  data: VariableData,
  inputs: InputsData
) => {
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
  await exec.exec(
    `security create-keychain -p ${inputs.keychainPassword} ${keychainPath}`
  )
  await exec.exec(`security set-keychain-settings -lut 21600 ${keychainPath}`)
  await exec.exec(
    `security unlock-keychain -p ${inputs.keychainPassword} ${keychainPath}`
  )
}

export const importCertToKeychain = (data: VariableData) => {
  // security import $CERTIFICATE_PATH -P "$P12_PASSWORD" -A -t cert -f pkcs12 -k $KEYCHAIN_PATH
  //       security set-key-partition-list -S apple-tool:,apple: -k "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
  //       security list-keychain -d user -s $KEYCHAIN_PATH
}

export const apllyProvision = () => {
  // mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
  //       cp $PP_PATH ~/Library/MobileDevice/Provisioning\ Profiles
}

export const cleanKeychainAndProvision = () => {
  // security delete-keychain $RUNNER_TEMP/app-signing.keychain-db
  // rm ~/Library/MobileDevice/Provisioning\ Profiles/build_pp.mobileprovision
}
