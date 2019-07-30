const { stringify: subtitleStringify } = require('subtitle')

function processText (text) {
  const input = text.replace(/[。，.,]$/, '')

  if (input.length < 30) {
    return input
  }

  const segments = input.split(/[,.，。?？]/).filter(el => el.length)

  if (segments.length < 2) {
    return text
  }

  const linePos = Math.floor(segments.length / 2)

  let ret = ''
  for (let i = 0; i < segments.length; ++i) {
    if (i === linePos) {
      ret += '\n'
    }

    ret += segments[i]

    if (i < segments.length - 1) {
      ret += ', '
    }
  }

  return ret
}

module.exports = function stringify (slices) {
  const srtText = subtitleStringify(slices.map(el => {
    let { text } = el

    return {
      ...el,
      text: processText(text)
    }
  }))
  return srtText
}
