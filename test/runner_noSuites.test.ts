import assert from 'assert';
import TestError from '../src/core/error';
import TestRunner from '../src/impl/runner';

export default async function testRunner_noSuites(): Promise<void> {

  const runner = new TestRunner();

  await assert.rejects(async () => {
    await runner.run([]);
  }, TestError);
}
