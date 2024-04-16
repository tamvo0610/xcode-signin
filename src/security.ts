import * as fs from 'fs'
import * as core from '@actions/core'
import * as utils from './utils/exec.utils'
import { Log } from './utils/log.utils'
import { Inputs, States } from './constants'

export async function installCertification() {
  await generateKeychain()
  await generateCertificate()
  await generateProvision()
  await apllyCertificate()
  await apllyProvision()
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
  Log.info('Generate Keychain')
  const path = process.env[States.KEYCHAIN_PATH]
  const password = core.getInput(Inputs.KEYCHAIN_PASSWORD)
  await utils.run(`security create-keychain -p ${password} ${path}`)
  await utils.run(`security set-keychain-settings -lut 21600 ${path}`)
  await utils.run(`security unlock-keychain -p ${password} ${path}`)
}

export const generateCertificate = async () => {
  Log.info('Generate Certificate')
  const path = process.env[States.CERTIFICATE_PATH] || ''
  const base64 = core.getInput(Inputs.CERTIFICATE_BASE64)
  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(path, buffer)
}

export const generateProvision = async () => {
  Log.info('Generate Provision Profile')
  const path = process.env[States.PROVISION_PROFILE_PATH] || ''
  const base64 = core.getInput(Inputs.PROVISION_PROFILE_BASE64)
  const buffer = Buffer.from(base64, 'base64')
  fs.writeFileSync(path, buffer)
}

export const apllyCertificate = async () => {
  Log.info('Apply Certificate')
  const certificatePath = process.env[States.CERTIFICATE_PATH] || ''
  const p12Password = core.getInput(Inputs.P12_PASSWORD)
  const keychainPath = process.env[States.KEYCHAIN_PATH] || ''
  const keychainPassword = core.getInput(Inputs.KEYCHAIN_PASSWORD)
  await utils.run(
    `security import ${certificatePath} -k ${keychainPath} -P ${p12Password} -A -t cert -f pkcs12`
  )
  await utils.run(
    `security set-key-partition-list -S apple-tool:,apple: -k ${keychainPassword} ${keychainPath}`
  )
  await utils.run(`security list-keychain -d user -s ${keychainPath}`)
}

export const apllyProvision = async () => {
  Log.info('Apply Provision Profile')
  const path = process.env[States.PROVISION_PROFILE_PATH] || ''
  await utils.run(`mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles`)
  await utils.run(`cp ${path} ~/Library/MobileDevice/Provisioning\\ Profiles`)
}

export const cleanKeychainAndProvision = async () => {
  const keychainPath = process.env[States.KEYCHAIN_PATH] || ''
  await utils.run(`security delete-keychain ${keychainPath}`)
  await utils.run(
    `rm ~/Library/MobileDevice/Provisioning\\ Profiles/build_pp.mobileprovision`
  )
}
