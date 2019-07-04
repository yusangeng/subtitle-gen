const FFmpeg = require('ffmpeg')

module.exports = function createVideo (filename) {
  return new Promise((resolve, reject) => {
    try {
      const process = new FFmpeg(filename)

      process.then((video) => {
        resolve(video)
      })
    } catch (err) {
      reject(err)
    }
  })
}
