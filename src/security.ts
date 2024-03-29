import * as exec from '@actions/exec'
import * as tmp from 'tmp'
import * as fs from 'fs'
import { execFileSync as execCP } from 'child_process'
import path from 'path'
import { Log } from './utils/log.ultis'
import * as utils from './utils/exec.utils'

interface VariableData {
  certificatePath: string
  provisionProfilePath: string
  runnerTempPath: string
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
  const variable = createVariable(inputs)
  const {
    certificatePath,
    provisionProfilePath,
    keychainPath,
    runnerTempPath
  } = variable
  await createKeychain(keychainPath, keychainPassword)
  await setKeychainSettings(keychainPath)
  await unlockKeychain(keychainPath, keychainPassword)
  await generateCertificate(certificatePath, certificateBase64)
  await generateProvision(provisionProfilePath, provisionProfileBase64)
  await apllyCertificate(variable, inputs)
  await qdqwdqw()
  // await importCertToKeychain(variable, inputs)
  // await apllyProvision(variable)
}

const qdqwdqw = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello')
    }, 40000)
  })
}

export const createVariable = (inputs: InputsData) => {
  const RUNNER_TEMP = process.env['RUNNER_TEMP'] || process.cwd()
  const CERTIFICATE_PATH = path.join(RUNNER_TEMP, 'build_certificate.p12')
  const P_PROFILE_PATH = path.join(RUNNER_TEMP, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(RUNNER_TEMP, 'app-signing.keychain-db')
  return {
    runnerTempPath: RUNNER_TEMP,
    certificatePath: CERTIFICATE_PATH,
    provisionProfilePath: P_PROFILE_PATH,
    keychainPath: KEYCHAIN_PATH
  }
}

const createKeychain = async (path: string, password: string) => {
  Log.info('Create Keychain')
  await utils.run(`security create-keychain -p ${password} ${path}`)
}

const setKeychainSettings = async (path: string) => {
  Log.info('Set Keychain Settings')
  await utils.run(`security set-keychain-settings -lut 21600 ${path}`)
}

const unlockKeychain = async (path: string, password: string) => {
  Log.info('Unlock Keychain')
  await utils.run(`security unlock-keychain -p ${password} ${path}`)
}

export const generateCertificate = async (path: string, base64: string) => {
  Log.info('Generate Certificate')
  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(path, buffer)
  // await utils.run(`echo -n ${base64} | base64 --decode -o ${path}`)
}

export const generateProvision = async (path: string, base64: string) => {
  Log.info('Generate Provision Profile')
  await utils.run(`echo -n ${base64} | base64 --decode -o ${path}`)
}

export const apllyCertificate = async (
  data: VariableData,
  inputs: InputsData
) => {
  const { keychainPath, certificatePath } = data
  const { keychainPassword, p12Password } = inputs
  // await utils.run(
  //   `security import ${certificatePath} -P ${p12Password} -A -t cert -f pkcs12 -k ${keychainPath}`
  // )
  await utils.run(
    `security import ${certificatePath} -k ${keychainPath} -P ${p12Password} -A -t cert -f pkcs12`
  )
  await utils.run(
    `security set-key-partition-list -S apple-tool:,apple: -k ${keychainPassword} ${keychainPath}`
  )
  await utils.run(`security list-keychain -d user -s ${keychainPath}`)
}

export const apllyProvision = async (data: VariableData) => {
  const { provisionProfilePath } = data
  await utils.run('mkdir -p ~/Library/MobileDevice/Provisioning Profiles')
  await utils.run(
    `cp ${provisionProfilePath} ~/Library/MobileDevice/Provisioning\ Profiles`
  )
}

export const cleanKeychainAndProvision = () => {
  // security delete-keychain $RUNNER_TEMP/app-signing.keychain-db
  // rm ~/Library/MobileDevice/Provisioning\ Profiles/build_pp.mobileprovision
}
