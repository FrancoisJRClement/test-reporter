import {ParseOptions, TestParser} from '../../test-parser'

import {getBasePath, normalizeFilePath} from '../../utils/path-utils'

import {GoogleTestCase, GoogleTestGroup, GoogleTestRun} from './googletest-json-types'

import {
  TestExecutionResult,
  TestRunResult,
  TestSuiteResult,
  TestGroupResult,
  TestCaseResult,
  TestCaseError
} from '../../test-results'

export class GoogleTestJsonParser implements TestParser {
  assumedWorkDir: string | undefined

  constructor(readonly options: ParseOptions) {}

  async parse(path: string, content: string): Promise<TestRunResult> {
    try {
      const testRun = JSON.parse(content) as GoogleTestRun
      const runResult = this.getTestRunResult(path, testRun)
      return Promise.resolve(runResult)
    } catch (parseException) {
      if (parseException instanceof SyntaxError)
        throw new Error('Error while parsing file "' + path + '":\n\t' + parseException.message)
      else throw parseException
    }
  }

  private getTestRunResult(path: string, testRun: GoogleTestRun): TestRunResult {
    const totalTime = this.getTime(testRun.time)

    const suites = [new TestSuiteResult(testRun.name, this.getGroups(testRun.testsuites), totalTime)]

    return new TestRunResult(this.getRelativePath(path), suites, totalTime)
  }

  private getGroups(testGroups: GoogleTestGroup[]): TestGroupResult[] {
    return testGroups.map(testGroup => new TestGroupResult(testGroup.name, this.getCases(testGroup.testsuite)))
  }

  private getCases(testCases: GoogleTestCase[]): TestCaseResult[] {
    return testCases.map(testCase => {
      const result = this.getResult(testCase)
      if (result === 'failed') {
        return new TestCaseResult(testCase.name, result, this.getTime(testCase.time), this.getError(testCase))
      } else {
        return new TestCaseResult(testCase.name, result, this.getTime(testCase.time))
      }
    })
  }

  private getTime(time: string): number {
    const fullLength = time.length
    const valueLength = fullLength - 1
    if (time[valueLength] !== 's') {
      return NaN
    } else {
      return Number(time.slice(0, valueLength)) * 1000
    }
  }

  private getResult(testCase: GoogleTestCase): TestExecutionResult {
    if (testCase.status !== 'RUN') {
      return 'skipped'
    } else if (testCase.failures === undefined || testCase.failures.length === 0) {
      return 'success'
    } else {
      return 'failed'
    }
  }

  private getError(testCase: GoogleTestCase): TestCaseError | undefined {
    if (testCase.failures.length === 0) {
      return undefined
    } else {
      const errorMessage = testCase.failures.map(testFailure => testFailure.failure).join('\n\n')
      return {details: errorMessage}
    }
  }

  private getRelativePath(path: string): string {
    const prefix = 'file://'
    if (path.startsWith(prefix)) {
      path = path.substr(prefix.length)
    }

    path = normalizeFilePath(path)
    const workDir = this.getWorkDir(path)
    if (workDir !== undefined && path.startsWith(workDir)) {
      path = path.substr(workDir.length)
    }
    return path
  }

  private getWorkDir(path: string): string | undefined {
    return (
      this.options.workDir ??
      this.assumedWorkDir ??
      (this.assumedWorkDir = getBasePath(path, this.options.trackedFiles))
    )
  }
}
