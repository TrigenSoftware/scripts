/* eslint-disable jsdoc/valid-types */

/**
 * Wrap value to array if it's not array.
 * @template T
 * @param {T} subject
 * @returns {T extends any[] ? T : T[]} Array.
 */
export function toArray(subject) {
  return Array.isArray(subject) ? subject : [subject]
}

/**
 * Test given subject is object.
 * @template T
 * @param {T} subject
 * @returns {T is {}} Is object or not.
 */
export function isObject(subject) {
  return subject !== null && typeof subject === 'object'
}
