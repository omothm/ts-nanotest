import { sync as readDirectory } from 'glob';
import DirectoryReader from '../core/directoryReader';

export default class NodeDirectoryReader implements DirectoryReader {

  read(globPatterns: string[]): string[] {
    return globPatterns.reduce((prev, cur) => {
      prev.push(...readDirectory(cur, { realpath: true }));
      return prev;
    }, [] as string[]);
  }
}
