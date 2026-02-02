import { exec } from 'child_process';
import { Container } from '../models/container';


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

export async function listContainers(): Promise<Container[]> {
  const output = await runContainerCommand(['list']);

  const lines = output
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // Only header present → no containers
  if (lines.length <= 1) {
    return [];
  }

  // Remove header row
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    // Split on 2+ spaces to preserve column integrity
    const parts = line.split(/\s{2,}/);

    return {
      id: parts[0] ?? '',
      image: parts[1] ?? '',
      os: parts[2] ?? '',
      arch: parts[3] ?? '',
      state: (parts[4]?.toLowerCase() as Container['state']) || 'unknown',
      addr: parts[5],
      cpus: parts[6],
      memory: parts[7],
      started: parts[8]
    };
  });
}
