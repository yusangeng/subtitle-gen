const path = require('path')
const { info, error } = require('../utils/log')
const separateAudioTrack = require('../ffmpeg/separateAudioTrack')
const splitTimeline = require('../ffmpeg/splitTimeline')

module.exports = async function genSrt (input, output) {
  info(`正在生成srt字幕文件...\n`)

  const inputFilename = path.resolve(process.cwd(), input)
  const outputFilename = path.resolve(process.cwd(), output)

  const audioFilename = await separateAudioTrack(inputFilename)
  const audioSliceFilenames = await splitTimeline(audioFilename)
}
