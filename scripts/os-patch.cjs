// Preloaded via `node --require` so it runs before any subsequent
// require('os') call. Replaces os.networkInterfaces with a stub that
// returns {} when the syscall fails in sandboxed environments.
'use strict'

const os = require('os')

const original = Object.getOwnPropertyDescriptor(os, 'networkInterfaces')
if (original && typeof original.value === 'function') {
  const patched = function patchedNetworkInterfaces() {
    try {
      const result = original.value.call(this)
      if (result && typeof result === 'object') return result
      return {}
    } catch (err) {
      if (
        err &&
        (err.syscall === 'uv_interface_addresses' ||
          /uv_interface_addresses/.test(String(err.message || '')))
      ) {
        return {}
      }
      throw err
    }
  }
  Object.defineProperty(os, 'networkInterfaces', {
    value: patched,
    writable: true,
    configurable: true,
    enumerable: original.enumerable,
  })
}
