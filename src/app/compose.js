const path = require('path')
const { info } = require('../utils/log')
const { composeVideoWithSubtitle } = require('../ffmpeg')

module.exports = async function compose (input, output, srtFilename) {
  info(`正在合成视频与字幕...\n`)

  if (!output) {
    throw new Error('输出文件路径不能为空.')
  }

  const inputFilename = path.resolve(process.cwd(), input)
  const outputFilename = path.resolve(process.cwd(), output)

  await composeVideoWithSubtitle(inputFilename, outputFilename, srtFilename)
}
