export default interface DirectoryReader {
  read(globPattern: string): string[];
}
