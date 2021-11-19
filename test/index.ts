import frameworkAcceptanceTests from './acceptance/framework.test';
import cliTests from './integration/cli.test';
import nodeDirectoryReaderTests from './integration/nodeDirectoryReader.test';
import nodeClassLoaderTests from './integration/nodeClassLoader.test';
import frameworkTests from './unit/framework.test';
import runnerTests from './unit/runner.test';

run().catch((reason) => {
  console.error(reason);
  process.exit(1);
});

async function run() {

  const testType: TestType = getTestType();

  const allTestFunctions: Record<TestType, (() => void | Promise<void>)[]> = {
    unit: [
      ...frameworkTests,
      ...runnerTests,
    ],
    integration: [
      ...cliTests,
      ...nodeDirectoryReaderTests,
      ...nodeClassLoaderTests,
    ],
    acceptance: [
      ...frameworkAcceptanceTests,
    ],
  };

  const testFunctions = allTestFunctions[testType];

  for (const func of testFunctions) {
    try {
      await func();
      console.log(`OK: ${func.name}`);
    } catch (err) {
      console.error(`Error in ${func.name}`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log('\nall pass');
}

type TestType = 'unit' | 'integration' | 'acceptance';

function getTestType(): TestType {
  if (process.argv.length < 3) {
    return 'unit';
  }
  const arg = process.argv[2];
  switch (arg) {
    case '-u':
      return 'unit';
    case '-i':
      return 'integration';
    case '-a':
      return 'acceptance';
  }
  throw new Error(`Unknown test type: ${arg}`);
}
