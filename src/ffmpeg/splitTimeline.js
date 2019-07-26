const fs = require('fs')
const VAD = require('node-vad')
const config = require('../config')

const { debounceTime } = config

module.exports = async function splitTimeline (audioFilename) {
  const data = fs.readFileSync(audioFilename)
  const vad = new VAD({
    mode: VAD.Mode.NORMAL, // VAD mode, see above
    audioFrequency: 16000, // Audiofrequency, see above
    debounceTime: debounceTime // Time for debouncing speech active state, default 1 second
  })

  vad.processAudio(data, 16000)
}
