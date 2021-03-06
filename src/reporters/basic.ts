import TestReport from '../core/report';
import TestReporter from '../impl/reporter';

export default class BasicReporter extends TestReporter {

  private static tick = '\u2713 ';
  private static cross = '\u274C';
  private static skipped = '- ';

  private currentSuite = '';
  private suites = new Set<string>();
  private errors: Error[] = [];

  override begin(): void {
    super.begin();
    this.suites.clear();
    this.errors = [];
  }

  override add(report: TestReport): void {
    super.add(report);

    if (report.suite !== this.currentSuite) {
      this.newSuite(report.suite);
    }

    if (report.error) {
      this.errors.push(report.error);
    }

    this.testResult(report);
  }

  override end(): void {
    for (const [index, error] of Object.entries(this.errors)) {
      const naturalIndex = Number(index) + 1;
      console.log(`\n${naturalIndex})`);
      console.log(error);
    }

    console.log();
    this.stats();
  }

  private newSuite(suite: string) {
    this.suites.add(suite);
    this.currentSuite = suite;
    console.log(`\n${suite}`);
  }

  private testResult(report: TestReport) {
    const symbol = this.chooseSymbol(report);
    const errorNumber = report.error ? Color.red(` (${this.errors.length})`) : '';
    console.log(`  ${symbol} ${report.test}${errorNumber}`);
  }

  private stats() {
    const numPassed = this.reports.filter((r) => !r.error && !r.skipped).length;
    const numFailed = this.reports.filter((r) => r.error).length;

    console.log(`Total suites:  ${this.suites.size}`);
    console.log(`Total tests:   ${this.reports.length}`);
    console.log(`Total passed:  ${numPassed ? Color.green(numPassed.toString()) : numPassed}`);
    console.log(`Total failed:  ${numFailed ? Color.red(numFailed.toString()) : numFailed}`);
    console.log(`Total skipped: ${this.reports.filter((r) => r.skipped).length}`);
  }

  private chooseSymbol(report: TestReport) {
    if (report.error) {
      return Color.red(BasicReporter.cross);
    }
    if (report.skipped) {
      return BasicReporter.skipped;
    }
    return Color.green(BasicReporter.tick);
  }
}

class Color {

  private static _reset = '\x1b[0m';
  private static _red = '\x1b[31m';
  private static _green = '\x1b[32m';

  static red(text: string): string {
    return Color.color(Color._red, text);
  }

  static green(text: string): string {
    return Color.color(Color._green, text);
  }

  private static color(color: string, text: string) {
    return `${color}${text}${Color._reset}`;
  }
}
