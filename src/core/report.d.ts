type TestReport = NonSkippedTestReport | SkippedTestReport;

export default TestReport;

interface NonSkippedTestReport {
  suite: string;
  test: string;
  skipped: false;
  error: Error | null;
}

interface SkippedTestReport {
  suite: string;
  test: string;
  skipped: true;
  error: null;
}
