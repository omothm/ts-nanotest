import ClassLoader from '../core/classLoader';
import { ClassLoadError } from '../core/errors';
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
      const errString = err instanceof Error
        ? err.stack || err.message
        : (err as object).toString();
      throw new ClassLoadError(`Could not load test suite from ${filepath}\n${errString}`);

    }
  }

}
