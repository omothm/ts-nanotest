export default interface TestReport {
  suite: string;
  test: string;
  error: Error | null;
}
