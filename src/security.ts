import path from 'path'
import * as exec from '@actions/exec'
import * as tmp from 'tmp'
import * as core from '@actions/core'
import * as fs from 'fs'
import { ExecOptions } from '@actions/exec/lib/interfaces'
import { exec as execCP } from 'child_process'
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
  console.log(`Current Action Path: ${__dirname}`)
  Log.info('Install certification')
  const runnerTemp = process.env['RUNNER_TEMP'] || process.cwd()
  Log.info(`RUNNER_TEMP ${process.env['RUNNER_TEMP']}`)
  Log.info(`runnerTemp ${runnerTemp}`)
  const variable = createVariable(inputs, runnerTemp)
  Log.info(`CertificatePath ${variable.certificatePath}`)
  Log.info(`PPPath ${variable.ppPath}`)
  Log.info(`KeychainPath ${variable.keychainPath}`)
  await importCertFromSecret(variable, inputs)
  // await createKeychain(variable, inputs)
  // await importCertToKeychain(variable, inputs)
  // await apllyProvision(variable)
}

export const createVariable = (inputs: InputsData, runnerTemp: string) => {
  const buffer = Buffer.from(inputs.certificateBase64, 'base64')
  const tempFile = tmp.fileSync()
  const q = tempFile.name
  fs.writeFileSync(q, buffer)

  const CERTIFICATE_PATH = path.join(runnerTemp, 'build_certificate.p12')
  const PP_PATH = path.join(runnerTemp, 'build_pp.mobileprovision')
  const KEYCHAIN_PATH = path.join(runnerTemp, 'app-signing.keychain-db')
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
  await exec.exec('chmod 777', [runnerTemp])
  await exec.exec('bash', [
    '-c',
    'echo "SGVsbG8gd29ybGQ=" >> certificate.base64'
  ])
  const a = await exec.getExecOutput(
    `echo ${'SGVsbG8gd29ybGQ='} >> ${runnerTemp}/certificate.base64`
  )

  Log.info(`a: ${a}`)
  const b = await exec.getExecOutput(
    `base64 --decode -i ${runnerTemp}/certificate.base64 -o ${certificatePath}`
  )
  Log.info(`b: ${b}`)
  // await exec.exec(
  //   `echo -n ${inputs.certificateBase64} | base64 --decode -o ${data.certificatePath}`
  // )
  // await exec.exec(
  //   `echo -n ${inputs.provisionProfileBase64} | base64 --decode -o ${data.ppPath}`
  // )
}

export const createKeychain = async (
  data: VariableData,
  inputs: InputsData
) => {
  Log.info('Create Keychain')
  const { keychainPath } = data
  await exec.exec(
    `security create-keychain -p ${inputs.keychainPassword} ${keychainPath}`
  )
  await exec.exec(`security set-keychain-settings -lut 21600 ${keychainPath}`)
  await exec.exec(
    `security unlock-keychain -p ${inputs.keychainPassword} ${keychainPath}`
  )
}

export const importCertToKeychain = async (
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
