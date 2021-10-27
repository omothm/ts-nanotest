import testFramework from './framework.test';
import testFramework_classLoadFail from './framework_classLoadFail.test';
import testRunner_noSuites from './runner_noSuites.test';
import testRunner_singleSuite_singleTest_fail from './runner_singleSuite_singleTest_fail.test';
import testRunner_singleSuite_singleTest_pass from './runner_singleSuite_singleTest_pass.test';
import testRunner_singleSuite_manyTests_allHooks
  from './runner_singleSuite_manyTests_allHooks.test';
import testRunner_manySuites from './runner_manySuites.test';

run().catch((reason) => {
  console.error(reason);
  process.exit(1);
});

async function run() {

  const testFunctions = [
    testFramework,
    testFramework_classLoadFail,
    testRunner_noSuites,
    testRunner_singleSuite_singleTest_pass,
    testRunner_singleSuite_singleTest_fail,
    testRunner_singleSuite_manyTests_allHooks,
    testRunner_manySuites,
  ];

  for (const func of testFunctions) {
    try {
      await func();
    } catch (err) {
      console.error(`Error in ${func.name}`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log('all pass');
}
