const fs = require('fs')
const { speech: AipSpeechClient } = require('baidu-aip-sdk')
const sleep = require('sleep-promise')
const { aipAppId, aipAPIKey, aipSecretKey } = require('../config')
const { info, error } = require('../utils/log')

module.exports = async function recognize (timeline) {
  info('正在进行语音识别...\n')

  const slices = []
  const client = new AipSpeechClient(aipAppId, aipAPIKey, aipSecretKey)
  const tl = timeline.slice()

  while (tl.length) {
    const { filename, startTime, duration } = tl.shift()
    const sliceData = fs.readFileSync(filename)
    const sliceBuffer = Buffer.from(sliceData)
    let response

    try {
      response = await client.recognize(sliceBuffer, 'pcm', 16000)
    } catch (err) {
      response = {
        err_no: -1,
        err_msg: `网络或服务器错误(${err.message})`
      }
    }

    const { err_no: errNo, err_msg: errMsg, result } = response

    if (errNo) {
      error(`识别错误: ${errMsg}`)
      error(`输入文件: ${filename}`)
      slices.push({
        text: '',
        start: startTime,
        end: startTime + duration,
        duration
      })
    } else {
      const text = result.join('')
      info(`识别结果: ${text}`)
      info(`输入文件: ${filename}`)

      slices.push({
        text,
        start: startTime,
        end: startTime + duration,
        duration
      })
    }

    await sleep(500)
  }

  return slices
}
