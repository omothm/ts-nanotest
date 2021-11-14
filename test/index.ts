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

  const integration = process.argv.length > 2 ? process.argv[2] === '-i' : false;

  const unitTestFunctions = [
    ...frameworkTests,
    ...runnerTests,
  ];

  const integrationTestFunctions = [
    ...cliTests,
    ...nodeDirectoryReaderTests,
    ...nodeClassLoaderTests,
  ];

  const testFunctions = integration ? integrationTestFunctions : unitTestFunctions;

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
