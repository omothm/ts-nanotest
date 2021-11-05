export default interface TestCases {
  [description: string]: () => void | Promise<void>;
}
