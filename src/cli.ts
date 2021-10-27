import ClassLoader from './core/classLoader';
import DirectoryReader from './core/directoryReader';
import { TestSuite } from './core/suite';
import TestFramework from './impl/framework';
import NodeClassLoader from './impl/nodeClassLoader';
import NodeDirectoryReader from './impl/nodeDirectoryReader';
import config from './config';
import activateTypescriptImports from './tsImport';

activateTypescriptImports();

main().catch(console.error);

async function main() {

  const globPattern = process.argv.length > 2 ? process.argv[2] : config.defaultPattern;
  console.log(`Testing ${globPattern}...`);

  const directoryReader: DirectoryReader = new NodeDirectoryReader();
  const classLoader: ClassLoader<TestSuite> = new NodeClassLoader();
  const framework = new TestFramework(
    directoryReader,
    classLoader,
  );

  const report = await framework.test(globPattern);

  console.log(JSON.stringify(report));
}
