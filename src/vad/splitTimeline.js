const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')
const VAD = require('node-vad')
const config = require('../config')
const { info } = require('../utils/log')

const { debounceTime } = config

module.exports = async function splitTimeline (audioFilename) {
  info('正在切分时间轴...\n')

  const timeline = []
  const inputStream = fs.createReadStream(audioFilename)
  const vadStream = VAD.createStream({
    mode: VAD.Mode.NORMAL, // VAD mode, see above
    audioFrequency: 16000, // Audiofrequency, see above
    debounceTime: debounceTime // Time for debouncing speech active state, default 1 second
  })

  const sliceDir = path.resolve(process.context.dir, './voices')

  mkdir.sync(sliceDir)
  let index = 0
  let sliceBufferList = []

  const task = (resolve) => inputStream.pipe(vadStream).on('data', async (data) => {
    const { speech, audioData } = data
    const { start, end, state, startTime, duration } = speech

    if (start) {
      info(`开始说话, 开始时间: ${startTime}`)

      sliceBufferList.push(audioData)

      return
    }

    if (end) {
      info(`停止说话, 开始时间: ${startTime}, 时长: ${duration}`)

      index++

      const sliceFilename = path.resolve(sliceDir, `./${index}-${startTime}-${duration}.pcm`)
      const sliceBuffer = Buffer.concat(sliceBufferList)

      info(`写入slice文件: ${sliceFilename}`)
      fs.writeFileSync(sliceFilename, sliceBuffer)
      timeline.push({
        filename: sliceFilename,
        startTime,
        duration
      })
      sliceBufferList = []

      return
    }

    if (state) {
      sliceBufferList.push(audioData)
    }
  }).on('end', () => {
    info('vad切分结束\n')
    resolve()
  })

  await new Promise((resolve) => {
    task(resolve)
  })

  return timeline
}
