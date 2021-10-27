export interface TestReport {
  suites: SuiteResult[];
}

export interface SuiteResult {
  name: string;
  tests: TestResult[];
}

interface TestResult {
  name: string;
  error: Error | null;
}
