import { sh } from '@trigen/scripts'

const EXPERIMENTAL_VM_MODULES_FLAG = '--experimental-vm-modules'

/**
 * Run tests with Jest.
 * @param {object} [options]
 * @param {string} [options.config] - path to config file.
 * @param {boolean} [options.esm] - enable native ES modules suppport.
 * @returns Task function.
 */
export function jest({
  config = 'jest.config.json',
  esm = false
} = {}) {
  const NODE_OPTIONS = !esm || process.env.NODE_OPTIONS?.includes(EXPERIMENTAL_VM_MODULES_FLAG)
    ? process.env.NODE_OPTIONS
    : process.env.NODE_OPTIONS
      ? `${process.env.NODE_OPTIONS} ${EXPERIMENTAL_VM_MODULES_FLAG}`
      : EXPERIMENTAL_VM_MODULES_FLAG

  return sh({
    NODE_ENV: 'test',
    NODE_OPTIONS
  }, 'jest', '-c', config)
}
