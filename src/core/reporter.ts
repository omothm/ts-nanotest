import TestReport from './report';

export default class TestReporter {

  protected reports: TestReport[] = [];

  begin(): void {
    this.reports = [];
  }

  end(): void {
    return;
  }

  add(report: TestReport): void {
    this.reports.push(report);
  }

  getReport(): TestReport[] {
    return this.reports;
  }
}
