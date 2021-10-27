import { sync as readDirectory } from 'glob';
import DirectoryReader from '../core/directoryReader';

export default class NodeDirectoryReader implements DirectoryReader {

  read(globPattern: string): string[] {
    return readDirectory(globPattern, { realpath: true });
  }
}
