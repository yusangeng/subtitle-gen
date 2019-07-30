const fs = require('fs')
const path = require('path')
const { info } = require('../utils/log')
const separateAudioTrack = require('../ffmpeg/separateAudioTrack')
const { splitTimeline } = require('../vad')
const { recognize } = require('../asr')
const { stringify } = require('../subtitle')

module.exports = async function genSrt (input, output) {
  info(`正在生成srt字幕文件...\n`)

  const inputFilename = path.resolve(process.cwd(), input)
  const outputFilename = output ? path.resolve(process.cwd(), output) : void 0

  const audioFilename = await separateAudioTrack(inputFilename)
  const timeline = await splitTimeline(audioFilename)
  const asrResult = await recognize(timeline)
  const srtText = stringify(asrResult)

  if (outputFilename) {
    info(`写入srt文件: ${outputFilename}\n`)
    fs.writeFileSync(outputFilename, srtText, {
      encoding: 'utf8'
    })

    return
  }

  info(`srt文件内容:\n${srtText}\n`)
}
