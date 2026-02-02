import { exec } from 'child_process';

export type ContainerErrorType =
  | 'CLI_NOT_FOUND'
  | 'SYSTEM_NOT_RUNNING'
  | 'UNKNOWN';

export class ContainerError extends Error {
  constructor(
    public type: ContainerErrorType,
    message: string
  ) {
    super(message);
  }
}

export function runContainerCommand(
  args: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `container ${args.join(' ')}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        const output = stderr || error.message;

        // 1. CLI not installed
        if (
          output.includes('command not found') ||
          error.message.includes('ENOENT')
        ) {
          reject(
            new ContainerError(
              'CLI_NOT_FOUND',
              'Apple Container CLI not found'
            )
          );
          return;
        }

        // 2. System not started
        if (
          output.includes('container system start') ||
          output.includes('system services are not running')
        ) {
          reject(
            new ContainerError(
              'SYSTEM_NOT_RUNNING',
              'Container system is not running'
            )
          );
          return;
        }

        // 3. Fallback
        reject(
          new ContainerError(
            'UNKNOWN',
            output
          )
        );
        return;
      }

      resolve(stdout);
    });
  });
}
