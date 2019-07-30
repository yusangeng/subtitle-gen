const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const deepMerge = require('deepmerge')
const { error } = require('../utils/log')

const defaultConfig = {
  debounceTime: 500,
  aipAppId: '',
  aipAPIKey: '',
  aipSecretKey: ''
}

let config = defaultConfig

try {
  const configFilename = path.resolve(userHome, './.subtitle-gen.json')

  if (!fs.existsSync(configFilename)) {
    fs.writeFileSync(configFilename, JSON.stringify(defaultConfig, null, 2), {
      encoding: 'utf8'
    })
  }

  const jsonText = fs.readFileSync(configFilename, { encoding: 'utf8' })
  const jsonContent = JSON.parse(jsonText)

  config = deepMerge(defaultConfig, jsonContent)

  const { aipAppId, aipAPIKey, aipSecretKey } = config

  if (!aipAppId || !aipAPIKey || !aipSecretKey) {
    throw new Error('缺少百度AIP应用相关配置.')
  }
} catch (err) {
  error(err.message)
  process.exit(1)
}

module.exports = config
