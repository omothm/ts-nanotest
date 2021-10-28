import ClassLoader from '../core/classLoader';
import TestError from '../core/error';
import { TestSuite } from '../core/suite';

export default class NodeClassLoader implements ClassLoader {

  async load(filepath: string): Promise<new () => TestSuite> {
    try {

      const suiteClass = (await import(filepath) as { default: new () => TestSuite }).default;
      if (!(suiteClass instanceof Function)) {
        throw new Error();
      }
      return suiteClass;

    } catch (err) {
      console.error(err);
      throw new TestError(`Could not load test suite from ${filepath}`);

    }
  }

}
