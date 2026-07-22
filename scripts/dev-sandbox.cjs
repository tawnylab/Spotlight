#!/usr/bin/env node
// Wrapper for `next dev` that patches os.networkInterfaces to handle
// sandboxed environments where uv_interface_addresses() is restricted.
// In normal terminals this is a no-op since the OS call works fine.

const { spawn } = require('child_process')
const patchPath = require('path').resolve(__dirname, 'os-patch.cjs')
const args = [
  'next',
  'dev',
  ...process.argv.slice(2),
]
const child = spawn('npx', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --require ${patchPath}`,
  },
})

child.on('exit', (code) => process.exit(code ?? 0))
process.on('SIGINT', () => child.kill('SIGINT'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
