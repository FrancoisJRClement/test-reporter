import * as fs from 'fs'
import * as path from 'path'

import {GoogleTestJsonParser} from '../src/parsers/googletest-json/googletest-json-parser'
import {ParseOptions} from '../src/test-parser'
import {getReport} from '../src/report/get-report'
import {normalizeFilePath} from '../src/utils/path-utils'

describe('googletest-json tests', () => {
  it('produces empty empty test run when there is no fixture instanciation ', async () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'empty', 'googletest-json.json')
    const filePath = normalizeFilePath(path.relative(__dirname, fixturePath))
    const fileContent = fs.readFileSync(fixturePath, {encoding: 'utf8'})

    const trackedFiles = ['testClogRecord.cpp']
    const opts: ParseOptions = {
      parseErrors: true,
      trackedFiles
    }

    const parser = new GoogleTestJsonParser(opts)
    const result = await parser.parse(filePath, fileContent)
    expect(result.tests).toBe(0)
    expect(result.result).toBe('success')
  })

  it('report from googletest test results matches snapshot', async () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'googletest-json.json')
    const outputPath = path.join(__dirname, '__outputs__', 'googletest-json.md')
    const filePath = normalizeFilePath(path.relative(__dirname, fixturePath))
    const fileContent = fs.readFileSync(fixturePath, {encoding: 'utf8'})

    const trackedFiles = ['testClogRecord.cpp']
    const opts: ParseOptions = {
      parseErrors: true,
      trackedFiles
    }

    const parser = new GoogleTestJsonParser(opts)
    const result = await parser.parse(filePath, fileContent)
    expect(result).toMatchSnapshot()

    const report = getReport([result])
    fs.mkdirSync(path.dirname(outputPath), {recursive: true})
    fs.writeFileSync(outputPath, report)
  })
})
