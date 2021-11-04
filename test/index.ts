import frameworkTests from './framework.test';
import runnerTests from './runner.test';

run().catch((reason) => {
  console.error(reason);
  process.exit(1);
});

async function run() {

  const testFunctions = [
    ...frameworkTests,
    ...runnerTests,
  ];

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

  console.log('all pass');
}
