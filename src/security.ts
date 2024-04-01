import * as fs from 'fs'
import * as core from '@actions/core'
import * as utils from './utils/exec.utils'
import { Log } from './utils/log.utils'
import { States } from './constants'

export async function installCertification() {
  Log.info('Create Keychain')
  await generateKeychain()
  // await utils.run(
  //   `security create-keychain -p ${keychainPassword} ${keychainPath}`
  // )
  // await utils.run(`security set-keychain-settings -lut 21600 ${keychainPath}`)
  // await utils.run(
  //   `security unlock-keychain -p ${keychainPassword} ${keychainPath}`
  // )
  // await generateCertificate(certificatePath, certificateBase64)
  // await generateProvision(provisionProfilePath, provisionProfileBase64)
  // await apllyCertificate(
  //   certificatePath,
  //   p12Password,
  //   keychainPath,
  //   keychainPassword
  // )
  // await apllyProvision(provisionProfilePath)
  await qdqwdqw()
}

const qdqwdqw = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello')
    }, 40000)
  })
}

const generateKeychain = async () => {
  const path = core.getState(States.KEYCHAIN_PATH)
  const password = core.getState(States.KEYCHAIN_PASSWORD)
  Log.info(`path: ${path}`)
  Log.info(`password: ${password}`)
  await utils.run(`security create-keychain -p ${password} ${path}`)
  await utils.run(`security set-keychain-settings -lut 21600 ${path}`)
  await utils.run(`security unlock-keychain -p ${password} ${path}`)
}

export const generateCertificate = async (path: string, base64: string) => {
  Log.info('Generate Certificate')
  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(path, buffer)
}

export const generateProvision = async (path: string, base64: string) => {
  Log.info('Generate Provision Profile')
  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(path, buffer)
}

export const apllyCertificate = async (
  certificatePath: string,
  p12Password: string,
  keychainPath: string,
  keychainPassword: string
) => {
  Log.info('Apply Certificate')
  await utils.run(
    `security import ${certificatePath} -k ${keychainPath} -P ${p12Password} -A -t cert -f pkcs12`
  )
  await utils.run(
    `security set-key-partition-list -S apple-tool:,apple: -k ${keychainPassword} ${keychainPath}`
  )
  await utils.run(`security list-keychain -d user -s ${keychainPath}`)
}

export const apllyProvision = async (path: string) => {
  Log.info('Apply Provision Profile')
  await utils.run(`mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles`)
  await utils.run(`cp ${path} ~/Library/MobileDevice/Provisioning\\ Profiles`)
}

export const cleanKeychainAndProvision = () => {
  // security delete-keychain $RUNNER_TEMP/app-signing.keychain-db
  // rm ~/Library/MobileDevice/Provisioning\ Profiles/build_pp.mobileprovision
}
