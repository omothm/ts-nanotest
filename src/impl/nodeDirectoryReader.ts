import { sync as readDirectory } from 'glob';
import DirectoryReader from '../core/directoryReader';

export default class NodeDirectoryReader implements DirectoryReader {

  read(globPatterns: string[], cwd?: string): string[] {
    return globPatterns.reduce((prev, cur) => {
      prev.push(...readDirectory(cur, { realpath: true, cwd }));
      return prev;
    }, [] as string[]);
  }
}
