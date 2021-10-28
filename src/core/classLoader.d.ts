import { TestSuite } from './suite';

export default interface ClassLoader {
  load(filepath: string): Promise<new () => TestSuite>;
}
