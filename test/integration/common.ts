import fs from 'fs';
import path from 'path';
import config from './config';

export function createTestBaseDirectory(): void {
  cleanupTestBaseDirectory();
  createDirectoryRecursively(config.testDirectory);
}

export function cleanupTestBaseDirectory(): void {
  fs.rmSync(config.testDirectory, { recursive: true, force: true });
}

export function createFile(filename: string, content = ''): void {
  const fileDirectory = path.dirname(filename);
  if (!fs.existsSync(fileDirectory)) {
    createDirectoryRecursively(path.join(config.testDirectory, fileDirectory));
  }
  fs.writeFileSync(fullPath(filename), content);
}

export function fullPath(filename: string): string {
  return path.resolve(config.testDirectory, filename);
}

function createDirectoryRecursively(directory: string) {
  fs.mkdirSync(directory, { recursive: true });
}
