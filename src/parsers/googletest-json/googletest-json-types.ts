/// reflects documentation at https://github.com/google/googletest/blob/main/docs/advanced.md

export interface GoogleTestFailure {
  failure: string
  type: string | 'Unknown type'
}

export interface GoogleTestCase {
  name: string
  file: string
  line: number
  status: 'RUN' | 'NOTRUN'
  result?: 'COMPLETED' | string
  timestamp?: string
  time: string
  classname: string
  failures: GoogleTestFailure[]
}

export interface GoogleTestGroup {
  name: string
  tests: number
  failures:number
  disabled: number
  errors?: number
  timestamp?: string
  time: string
  testsuite: GoogleTestCase[]
}

export interface GoogleTestRun {
  name: string
  tests: number
  failures:number
  disabled: number
  errors: number
  timestamp?: string
  time: string
  testsuites: GoogleTestGroup[]
}