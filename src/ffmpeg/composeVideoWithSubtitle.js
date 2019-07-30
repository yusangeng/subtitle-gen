const fs = require('fs')
const { promisfy } = require('promisfy')
const createVideo = require('../utils/createVideo')
const { info } = require('../utils/log')

module.exports = async function composeVideoWithSubtitle (input, output, srtFilename) {
  info('正在合成字幕...\n')

  if (fs.existsSync(output)) {
    throw new Error(`目标文件已经存在, 请先删除: ${output}`)
  }

  const video = await createVideo(input)

  const file = await promisfy((callback) => {
    video.addCommand('-vf', `subtitles=${srtFilename}`)
    video.save(output, callback)
  })()

  info(`合成视频文件: ${file}.\n`)

  return file
}
