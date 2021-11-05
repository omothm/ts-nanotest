#!/usr/bin/env node

import ClassLoader from './core/classLoader';
import DirectoryReader from './core/directoryReader';
import TestReporter from './impl/reporter';
import TestFramework from './impl/framework';
import NodeClassLoader from './impl/nodeClassLoader';
import NodeDirectoryReader from './impl/nodeDirectoryReader';
import BasicReporter from './reporters/basic';
import config from './config';
import activateTypescriptImports from './tsImport';

activateTypescriptImports();

main().catch(console.error);

async function main() {

  const globPatterns = process.argv.length > 2 ? process.argv.slice(2) : [config.defaultPattern];

  const directoryReader: DirectoryReader = new NodeDirectoryReader();
  const classLoader: ClassLoader = new NodeClassLoader();
  const reporter: TestReporter = new BasicReporter();
  const framework = new TestFramework(
    directoryReader,
    classLoader,
    reporter,
  );

  await framework.test(globPatterns);
}
