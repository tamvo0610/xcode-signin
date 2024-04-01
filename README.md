# Install Apple Code-signing Certificates and Provision Profile

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](LICENSE)

## Introduction

The signing process involves storing certificates and provisioning profiles,
transferring them to the runner, importing them to the runner's keychain, and
using them in your build.

Create secrets in your repository or organization for the following items:

- `BUILD_CERTIFICATE_BASE64`: Apple signing certificate `p12` file. For more
  information on exporting your signing certificate from Xcode, see the
  [Xcode documentation](https://help.apple.com/xcode/mac/current/#/dev154b28f09).

```sh
base64 -i CertificateFile.p12 | pbcopy
```

- `P12_PASSWORD`: Password for your Apple signing certificate
- `BUILD_PROVISION_PROFILE_BASE64`: Apple provisioning profile. For more
  information on exporting your provisioning profile from Xcode, see the
  [Xcode documentation](https://help.apple.com/xcode/mac/current/#/deva899b4fe5).

```sh
base64 -i ProvisionProfileFile.mobileprovision | pbcopy
```

- `KEYCHAIN_PASSWORD`: Keychain password.

## Usage

```yaml
uses: tamvo0610/xcode-signin@v1
with:
  BUILD_CERTIFICATE_BASE64: ${{secrets.BUILD_CERTIFICATE_BASE64}}
  BUILD_PROVISION_PROFILE_BASE64: ${{secrets.BUILD_PROVISION_PROFILE_BASE64}}
  P12_PASSWORD: ${{secrets.P12_PASSWORD}}
  KEYCHAIN_PASSWORD: ${{secrets.KEYCHAIN_PASSWORD}}
```

## Additional Arguments

See [action.yml](action.yml) for more details.

## License

Any contributions made under this project will be governed by the
[MIT License](LICENSE).

## Authors

- [@Rio](https://www.github.com/tamvo0610)
