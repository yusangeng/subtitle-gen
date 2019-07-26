const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const deepMerge = require('deepmerge')
const { error } = require('../utils/log')

const defaultConfig = {
  debounceTime: 1000
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
} catch (err) {
  error(err.message)
}

module.exports = config
