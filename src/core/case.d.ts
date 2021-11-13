export default interface TestCase {
  name: string;
  run: () => void | Promise<void>;
  skip?: boolean;
}
