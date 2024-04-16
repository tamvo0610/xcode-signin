import * as core from '@actions/core'
import { exec } from 'child_process'
import * as fs from 'fs'
import path from 'path'
import { Inputs } from 'src/constants'
import { Log } from './utils/log.utils'

export class StateSingleton {
  private RUNNER_TEMP = process.env['RUNNER_TEMP'] || process.cwd()
  private CERTIFICATE_NAME = 'build_certificate.p12'
  private P_PROFILE_NAME = 'build_pp.mobileprovision'
  private P_PROFILE_STORE = `~/Library/MobileDevice/Provisioning\\ Profiles`
  private KEYCHAIN_NAME = 'app-signing.keychain-db'
  public CERTIFICATE_PATH = ''
  public CERTIFICATE_BASE64 = ''
  public P12_PASSWORD = ''
  public P_PROFILE_PATH = ''
  public P_PROFILE_BASE64 = ''
  public KEYCHAIN_PATH = ''
  public KEYCHAIN_PASSWORD = ''

  private static instance: StateSingleton

  constructor() {}

  public static getInstance(): StateSingleton {
    if (!StateSingleton.instance) {
      StateSingleton.instance = new StateSingleton()
    }
    return StateSingleton.instance
  }

  public initVariable() {
    // CERTIFICATES
    const CERTIFICATE_PATH = path.join(this.RUNNER_TEMP, this.CERTIFICATE_NAME)
    const CERTIFICATE_BASE64 = core.getInput(Inputs.CERTIFICATE_BASE64)
    const P12_PASSWORD = core.getInput(Inputs.P12_PASSWORD)
    // PROVISION PROFILE
    const P_PROFILE_PATH = path.join(this.RUNNER_TEMP, this.P_PROFILE_NAME)
    const P_PROFILE_BASE64 = core.getInput(Inputs.PROVISION_PROFILE_BASE64)
    // KEYCHAIN
    const KEYCHAIN_PATH = path.join(this.RUNNER_TEMP, this.KEYCHAIN_NAME)
    const KEYCHAIN_PASSWORD = core.getInput(Inputs.KEYCHAIN_PASSWORD)
    this.CERTIFICATE_PATH = CERTIFICATE_PATH
    this.CERTIFICATE_BASE64 = CERTIFICATE_BASE64
    this.P12_PASSWORD = P12_PASSWORD
    this.P_PROFILE_PATH = P_PROFILE_PATH
    this.P_PROFILE_BASE64 = P_PROFILE_BASE64
    this.KEYCHAIN_PATH = KEYCHAIN_PATH
    this.KEYCHAIN_PASSWORD = KEYCHAIN_PASSWORD
    return {
      CERTIFICATE_BASE64,
      P_PROFILE_BASE64,
      P12_PASSWORD,
      KEYCHAIN_PASSWORD
    }
  }

  public installCertificate = async () => {
    await this.generateKeychain()
    await this.generateCertificate()
    await this.generateProvision()
    await this.apllyCertificate()
    await this.apllyProvision()
  }

  public cleanCertificate = async () => {
    Log.info('Clean Certificate')
    const storePath = path.join(this.P_PROFILE_STORE, this.CERTIFICATE_NAME)
    await this.execRun(`security delete-keychain ${this.KEYCHAIN_PATH}`)
    await this.execRun(`rm ${storePath}`)
  }

  private execRun = async (str: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      exec(str, (error, stdout) => {
        if (error) {
          return reject(error.message)
        }
        resolve(stdout.trim())
      })
    })
  }

  private generateKeychain = async () => {
    const path = this.KEYCHAIN_PATH
    const password = this.KEYCHAIN_PASSWORD
    Log.info('Generate Keychain')
    await this.execRun(`security create-keychain -p ${password} ${path}`)
    await this.execRun(`security set-keychain-settings -lut 21600 ${path}`)
    await this.execRun(`security unlock-keychain -p ${password} ${path}`)
  }

  private generateCertificate = async () => {
    Log.info('Generate Certificate')
    const buffer = Buffer.from(this.CERTIFICATE_BASE64, 'base64')
    fs.writeFileSync(this.CERTIFICATE_PATH, buffer)
  }

  private generateProvision = async () => {
    Log.info('Generate Provision Profile')
    const buffer = Buffer.from(this.P_PROFILE_BASE64, 'base64')
    fs.writeFileSync(this.P_PROFILE_PATH, buffer)
  }

  private apllyCertificate = async () => {
    Log.info('Apply Certificate')
    await this.execRun(
      `security import ${this.CERTIFICATE_PATH} -k ${this.KEYCHAIN_PATH} -P ${this.P12_PASSWORD} -A -t cert -f pkcs12`
    )
    await this.execRun(
      `security set-key-partition-list -S apple-tool:,apple: -k ${this.KEYCHAIN_PASSWORD} ${this.KEYCHAIN_PATH}`
    )
    await this.execRun(
      `security list-keychain -d user -s ${this.KEYCHAIN_PATH}`
    )
  }

  private apllyProvision = async () => {
    Log.info('Apply Provision Profile')
    await this.execRun(`mkdir -p ${this.P_PROFILE_STORE}`)
    await this.execRun(`cp ${this.P_PROFILE_PATH} ${this.P_PROFILE_STORE}`)
  }
}
