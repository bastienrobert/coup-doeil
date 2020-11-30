'use strict'

const fs = require('fs')
const { dirname } = require('path')
const { compile } = require('glslify')

function compressShader(code) {
  let needNewline = false
  return code
    .replace(
      /\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/(?:\\(?:\r\n|\n\r|\n|\r)|[^\n\r])*/g,
      '',
    )
    .split(/\n+/)
    .reduce((result, line) => {
      line = line.trim().replace(/\s{2,}|\t/, ' ')
      if (line.charAt(0) === '#') {
        if (needNewline) {
          result.push('\n')
        }
        result.push(line, '\n')
        needNewline = false
      } else {
        result.push(
          line.replace(
            /\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g,
            '$1',
          ),
        )
        needNewline = true
      }
      return result
    }, [])
    .join('')
    .replace(/\n+/g, '\n')
}

module.exports = function glslifyPlugin(_, userOptions) {
  const options = Object.assign(
    {
      include: ['.vs', '.fs', '.vert', '.frag', '.glsl'],
      compress: true,
    },
    userOptions,
  )

  return {
    name: 'snowpack-glslify-plugin',
    resolve: {
      input: options.include,
      output: ['.js'],
    },
    async load({ filePath }) {
      let code = await fs.promises.readFile(filePath, 'utf-8')

      const fileOptions = Object.assign(
        {
          basedir: dirname(filePath),
        },
        options,
      )

      code = compile(code, fileOptions)
      if (options.compress !== false) {
        code = compressShader(code)
      }

      return {
        '.js': {
          code: `/* eslint-disable */
          export default ${JSON.stringify(code)};`,
          map: { mappings: '' },
        },
      }
    },
  }
}
