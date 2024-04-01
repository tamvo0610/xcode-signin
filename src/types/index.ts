export interface VariableData {
  certificatePath: string
  provisionProfilePath: string
  runnerTempPath: string
  keychainPath: string
}

export interface InputsData {
  certificateBase64: string
  provisionProfileBase64: string
  p12Password: string
  keychainPassword: string
}
