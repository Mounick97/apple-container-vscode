export type ContainerState =
  | 'running'
  | 'stopped'
  | 'paused'
  | 'unknown';

export interface Container {
  id: string;
  image: string;
  os: string;
  arch: string;
  state: ContainerState;
  addr?: string;
  cpus?: string;
  memory?: string;
  started?: string;
}