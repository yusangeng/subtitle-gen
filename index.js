#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const mkdir = require('mkdirp')
const shortid = require('shortid')
const rmrf = require('rmrf')
const gensrt = require('./src/app/gensrt')
const compose = require('./src/app/compose')
const genvideo = require('./src/app/genvideo')
const { error } = require('./src/utils/log')

let errno = 0

async function run (fn) {
  try {
    await fn()
  } catch (err) {
    error(err.stack || err.msg || err)
    throw err
  }
}

program
  .version('0.1.1')
  .option('-i --input <path>', 'input video file')
  .option('-o --output <path>', 'output file')
  .option('-s --srt <path>', 'input srt file')
  .option('-nr --noremovetemp', 'skip removing temporary files')

program.command('gensrt')
  .description('Generate srt file.')
  .action(async () => {
    const contextDir = path.resolve(process.cwd(), `./.context_${shortid()}`)
    mkdir.sync(contextDir)
    process.context = { dir: contextDir }

    try {
      await run(async () => gensrt(program.input, program.output))
    } catch (err) {
      errno = 1
    } finally {
      if (!program.noremovetemp) {
        rmrf(contextDir)
      }

      process.exit(errno)
    }
  })

program.command('compose')
  .description('Compose input video file with input srt file.')
  .action(async () => {
    const contextDir = path.resolve(process.cwd(), `./.context_${shortid()}`)
    mkdir.sync(contextDir)
    process.context = { dir: contextDir }

    try {
      await run(async () => compose(program.input, program.output, program.srt))
    } catch (err) {
      errno = 1
    } finally {
      if (!program.noremovetemp) {
        rmrf(contextDir)
      }

      process.exit(errno)
    }
  })

program.command('genvideo')
  .description('Generate video file with inline subtitle.')
  .action(async () => {
    const contextDir = path.resolve(process.cwd(), `./.context_${shortid()}`)
    mkdir.sync(contextDir)
    process.context = { dir: contextDir }

    try {
      await run(async () => genvideo(program.input, program.output))
    } catch (err) {
      errno = 1
    } finally {
      if (!program.noremovetemp) {
        rmrf(contextDir)
      }

      process.exit(errno)
    }
  })

program.parse(process.argv)
