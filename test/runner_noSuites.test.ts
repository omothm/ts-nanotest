import assert from 'assert';
import TestError from '../src/core/error';
import TestReporter from '../src/core/reporter';
import TestRunner from '../src/impl/runner';

export default async function testRunner_noSuites(): Promise<void> {

  const reporter = new TestReporter();
  const runner = new TestRunner(reporter);

  await assert.rejects(async () => {
    await runner.run([]);
  }, TestError);
}
