import * as exec from '@actions/exec'
import { execFileSync as execCP } from 'child_process'
import path from 'path'
import { Log } from './utils/log.ultis'
import * as utils from './utils/exec.utils'

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
  const {
    certificateBase64,
    provisionProfileBase64,
    keychainPassword,
    p12Password
  } = inputs
  const {
    certificatePath,
    provisionProfilePath,
    keychainPath,
    runnerTempPath
  } = createVariable(inputs)
  await createKeychain(keychainPath, keychainPassword)
  await setKeychainSettings(keychainPath)
  await unlockKeychain(keychainPath, keychainPassword)
  await generateCertificate(certificatePath, certificateBase64)
  await generateProvision(provisionProfilePath, provisionProfileBase64)
  await qdqwdqw()
  // await apllyCertificate()
  // await importCertToKeychain(variable, inputs)
  // await apllyProvision(variable)
}

const qdqwdqw = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello')
    }, 10000)
  })
}

export const createVariable = (inputs: InputsData) => {
  const RUNNER_TEMP = process.env['RUNNER_TEMP'] || process.cwd()
  const CERTIFICATE_PATH = path.join(RUNNER_TEMP, 'build_certificate.p12')
  const P_PROFILE_PATH = path.join(RUNNER_TEMP, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(RUNNER_TEMP, 'app-signing.keychain')
  return {
    runnerTempPath: RUNNER_TEMP,
    certificatePath: CERTIFICATE_PATH,
    provisionProfilePath: P_PROFILE_PATH,
    keychainPath: KEYCHAIN_PATH
  }
}

const createKeychain = async (path: string, password: string) => {
  Log.info('Create Keychain')
  const args = ['create-keychain', '-p', password, path]
  await exec.exec('security', args)
}

const setKeychainSettings = async (path: string) => {
  Log.info('Set Keychain Settings')
  const args = ['set-keychain-settings', '-lut', '21600', path]
  await exec.exec('security', args)
}

const unlockKeychain = async (path: string, password: string) => {
  Log.info('Unlock Keychain')
  const args = ['unlock-keychain', '-p', password, path]
  await exec.exec('security', args)
}

export const generateCertificate = async (path: string, base64: string) => {
  Log.info('Generate Certificate')
  const args = ['-n', base64, '|', 'base64', '--decode', '-o', path]
  // await exec.exec(`echo`, args)
  await utils.run(`echo -n ${base64} | base64 --decode -o ${path}`)
}

export const generateProvision = async (path: string, base64: string) => {
  Log.info('Generate Provision Profile')
  const args = ['-n', base64, '|', 'base64', '--decode', '-o', path]
  await exec.exec(`echo`, args)
}

export const apllyCertificate = async (
  data: VariableData,
  inputs: InputsData
) => {
  const { keychainPath, certificatePath } = data
  const { keychainPassword, p12Password } = inputs
  await exec.exec(
    `security import ${certificatePath} -P ${p12Password} -A -t cert -f pkcs12 -k ${keychainPath}`
  )
  await exec.exec(
    `security set-key-partition-list -S apple-tool:,apple: -k ${keychainPassword} ${keychainPath}`
  )
  await exec.exec(`security list-keychain -d user -s ${keychainPath}`)
}

export const apllyProvision = async (data: VariableData) => {
  const { ppPath } = data
  await exec.exec('mkdir -p ~/Library/MobileDevice/Provisioning Profiles')
  await exec.exec(`cp ${ppPath} ~/Library/MobileDevice/Provisioning\ Profiles`)
}

export const cleanKeychainAndProvision = () => {
  // security delete-keychain $RUNNER_TEMP/app-signing.keychain-db
  // rm ~/Library/MobileDevice/Provisioning\ Profiles/build_pp.mobileprovision
}
