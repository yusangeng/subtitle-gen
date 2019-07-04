#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const mkdir = require('mkdirp')
const shortid = require('shortid')
const rmrf = require('rmrf')
const srt = require('./src/app/srt')
const compose = require('./src/app/compose')
const video = require('./src/app/video')
const { error } = require('./src/utils/log')

async function run (fn) {
  try {
    await fn()
  } catch (err) {
    error(err.message || err.msg)
    process.exit(1)
  }
}

program
  .version('1.0.0')
  .option('-i --input <path>', 'input video file')
  .option('-o --output <path>', 'output file')
  .option('-s --srt <path>', 'input srt file')

program.command('srt')
  .description('Generate srt file.')
  .action(async () => {
    const contextDir = path.resolve(process.cwd(), `./context_${shortid()}`)
    mkdir.sync(contextDir)
    process.context = { dir: contextDir }

    try {
      await run(async () => srt(program.input, program.output))
    } finally {
      // rmrf.sync(contextDir)
    }
  })

program.command('compose')
  .description('Compose input video file with input srt file.')
  .action(async () => {
    const contextDir = path.resolve(process.cwd(), `./context_${shortid()}`)
    mkdir.sync(contextDir)
    process.context = { dir: contextDir }

    try {
      await run(async () => compose(program.input, program.srt, program.output))
    } finally {
      rmrf.sync(contextDir)
    }
  })

program.command('video')
  .description('Generate video file with inline subtitle.')
  .action(async () => {
    const contextDir = path.resolve(process.cwd(), `./context_${shortid()}`)
    mkdir.sync(contextDir)
    process.context = { dir: contextDir }

    try {
      await run(async () => video(program.input, program.output))
    } finally {
      rmrf.sync(contextDir)
    }
  })

program.parse(process.argv)
