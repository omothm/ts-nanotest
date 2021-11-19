import assert, { AssertionError } from 'assert';
import { TestCase, TestSuite } from '../../src';
import FrameworkProxy from '../common/framework';

export default [

  async function testAcceptance_framework(): Promise<void> {
    const suiteClasses = {
      FiveTestsPassingSuite,
      FourTestsFailingSuite,
      TwoPassingTwoFailingSuite,
      EmptySuite,
    };
    const framework = createFramework(suiteClasses);

    const report = await framework.runTestsAndGetReport();

    assert.equal(report.length, 13);

    assert.equal(report[0].suite, FiveTestsPassingSuite.name);
    assert.equal(report[0].test, 'test 1');
    assert.equal(report[0].skipped, false);
    assert.equal(report[0].error, null);

    assert.equal(report[1].suite, FiveTestsPassingSuite.name);
    assert.equal(report[1].test, 'test 2');
    assert.equal(report[1].skipped, true);
    assert.equal(report[1].error, null);

    assert.equal(report[2].suite, FiveTestsPassingSuite.name);
    assert.equal(report[2].test, 'test 3');
    assert.equal(report[2].skipped, false);
    assert.equal(report[2].error, null);

    assert.equal(report[3].suite, FiveTestsPassingSuite.name);
    assert.equal(report[3].test, 'test 4');
    assert.equal(report[3].skipped, false);
    assert.equal(report[3].error, null);

    assert.equal(report[4].suite, FiveTestsPassingSuite.name);
    assert.equal(report[4].test, 'test 5');
    assert.equal(report[4].skipped, false);
    assert.equal(report[4].error, null);

    assert.equal(report[5].suite, FourTestsFailingSuite.name);
    assert.equal(report[5].test, 'test 1');
    assert.equal(report[5].skipped, false);
    assert.ok(report[5].error instanceof AssertionError);

    assert.equal(report[6].suite, FourTestsFailingSuite.name);
    assert.equal(report[6].test, 'test 2');
    assert.equal(report[6].skipped, true);
    assert.equal(report[6].error, null);

    assert.equal(report[7].suite, FourTestsFailingSuite.name);
    assert.equal(report[7].test, 'test 3');
    assert.equal(report[7].skipped, false);
    assert.ok(report[7].error instanceof AssertionError);

    assert.equal(report[8].suite, FourTestsFailingSuite.name);
    assert.equal(report[8].test, 'test 4');
    assert.equal(report[8].skipped, false);
    assert.ok(report[8].error instanceof AssertionError);

    assert.equal(report[9].suite, TwoPassingTwoFailingSuite.name);
    assert.equal(report[9].test, 'test 1');
    assert.equal(report[9].skipped, false);
    assert.equal(report[9].error, null);

    assert.equal(report[10].suite, TwoPassingTwoFailingSuite.name);
    assert.equal(report[10].test, 'test 2');
    assert.equal(report[10].skipped, true);
    assert.equal(report[10].error, null);

    assert.equal(report[11].suite, TwoPassingTwoFailingSuite.name);
    assert.equal(report[11].test, 'test 3');
    assert.equal(report[11].skipped, false);
    assert.ok(report[11].error instanceof AssertionError);

    assert.equal(report[12].suite, TwoPassingTwoFailingSuite.name);
    assert.equal(report[12].test, 'test 4');
    assert.equal(report[12].skipped, false);
    assert.ok(report[12].error instanceof AssertionError);
  },

];

function createFramework(suiteClasses: { [name: string]: new () => TestSuite }) {
  return new FrameworkProxy(suiteClasses);
}

class FiveTestsPassingSuite extends TestSuite {

  private pass = false;

  beforeEach(): void {
    this.pass = true;
  }

  afterEach(): void {
    this.pass = false;
  }

  tests(): TestCase[] {
    return [
      this.test('test 1', () => { assert.ok(this.pass); }),
      this.skip('test 2', () => { assert.ok(!this.pass); }),
      this.test('test 3', () => { assert.ok(this.pass); }),
      this.test('test 4', () => { assert.ok(this.pass); }),
      this.test('test 5', () => { assert.ok(this.pass); }),
    ];
  }
}

class FourTestsFailingSuite extends TestSuite {

  private pass = true;

  beforeAll(): void {
    this.pass = false;
  }

  afterAll(): void {
    this.pass = true;
  }

  tests(): TestCase[] {
    return [
      this.test('test 1', () => { assert.ok(this.pass); }),
      this.skip('test 2', () => { assert.ok(!this.pass); }),
      this.test('test 3', () => { assert.ok(this.pass); }),
      this.test('test 4', () => { assert.ok(this.pass); }),
    ];
  }
}

class TwoPassingTwoFailingSuite extends TestSuite {

  tests(): TestCase[] {
    return [
      this.test('test 1', () => { assert.equal(1, 1); }),
      this.skip('test 2', () => { assert.equal(2, 2); }),
      this.test('test 3', () => { assert.equal(3, 4); }),
      this.test('test 4', () => { assert.equal(4, 5); }),
    ];
  }
}

class EmptySuite extends TestSuite {

  tests(): TestCase[] {
    return [];
  }
}
