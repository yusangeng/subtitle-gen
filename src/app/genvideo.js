const path = require('path')
const gensrt = require('./gensrt')
const { composeVideoWithSubtitle } = require('../ffmpeg')
const { info } = require('../utils/log')

module.exports = async function genVideo (input, output) {
  info(`正在生成带字幕视频...\n`)

  if (!output) {
    throw new Error('输出文件路径不能为空.')
  }

  const inputFilename = path.resolve(process.cwd(), input)
  const outputFilename = path.resolve(process.cwd(), output)
  const srtFilename = path.resolve(process.context.dir, './subtitle.srt')

  await gensrt(inputFilename, srtFilename)
  await composeVideoWithSubtitle(inputFilename, outputFilename, srtFilename)
}
