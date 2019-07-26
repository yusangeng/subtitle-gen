const path = require('path')
const { promisfy } = require('promisfy')
const shortid = require('shortid')
const createVideo = require('../utils/createVideo')
const { info } = require('../utils/log')

module.exports = async function separateAudioTrack (filename) {
  info('正在分离音轨...\n')

  const video = await createVideo(filename)
  const { audio: audioInfo } = video.metadata
  const { codec, bitrate, sample_rate: sampleRate, channels } = audioInfo

  info('音频信息:')
  info(`  codec: ${codec}`)
  info(`  bitrate: ${bitrate}`)
  info(`  samplerate: ${sampleRate}`)
  info(`  channels: ${channels.raw}, ${channels.value}\n`)

  info('正在生成音轨文件...\n')

  const { dir } = process.context
  const audioTrackFilename = path.resolve(dir, `${shortid()}.pcm`)

  const file = await promisfy((callback) => {
    video.addCommand('-f', 's16le')

    video
      .setDisableVideo()
      .setAudioFrequency(16000)
      .setAudioChannels(1)
      .save(audioTrackFilename, callback)
  })()

  info(`音轨文件: ${file}.\n`)

  return audioTrackFilename
}
