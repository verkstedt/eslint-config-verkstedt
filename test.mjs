#!/usr/bin/env -S node --test

import assert from 'node:assert'
import { resolve } from 'node:path'
import { describe, it, beforeEach } from 'node:test'

import EsLintModule from 'eslint'

const { ESLint } = EsLintModule

describe('EsLint', () => {
  describe('preset: typescript', () => {
    /** @type {ESLint} */
    let eslint

    beforeEach(() => {
      eslint = new ESLint({
        overrideConfigFile: resolve('./typescript.js'),
      })
    })

    it('works on an empty file', async () => {
      const input = ''

      const [result] = await eslint.lintText(input, {
        filePath: './test-input.ts',
      })

      assert.deepEqual(result.messages, [])
    })

    it('has working @typescript-eslint/no-redeclare', async () => {
      const input = `
const redeclared = 'foo'
const redeclared = 'bar'

export { redeclared }
`.trimStart()

      const [result] = await eslint.lintText(input, {
        filePath: './test-input.ts',
      })

      assert.strictEqual(result.messages.length, 1)
      assert.strictEqual(
        result.messages[0].ruleId,
        '@typescript-eslint/no-redeclare'
      )
    })
  })
})
