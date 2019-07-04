const chalk = require('chalk-stencil')

module.exports = { info, error }

function info (text) {
  const template = chalk`${'mark::green'} ${text}`
  console.log(template({ mark: 'INF' }))
}

function error (text) {
  const template = chalk`${'mark::red'} ${text}`
  console.error(template({ mark: 'ERR' }))
}
