import { register } from 'ts-node';

export default function activateTypescriptImports(): void {
  register({ transpileOnly: true });
}
