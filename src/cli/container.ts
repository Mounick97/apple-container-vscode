import { exec } from 'child_process';

export function runContainerCommand(
  args: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `container ${args.join(' ')}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
        return;
      }

      resolve(stdout);
    });
  });
}
