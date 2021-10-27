export default interface ClassLoader<T> {
  load(filepath: string): Promise<new () => T>;
}
