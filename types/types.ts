export type OpenedFile = {
  name: string;
  content: string;
  path: string;
};

export type SSH_CONFIG = {
  host: string;
  port: number;
  user: string;
  privateKey?: string;
  passphrase?: string;
  password?: string;
};
export type LOCAL_SSH_CONFIG = {
  host: string;
  port: number;
  user: string;
  updateTime: number;
};

type PromptType = "simple" | "full";
export type TerminalMode = "ready" | "waiting" | "executing";

export interface SSHApi {
  write: (data: { cmd: string; processId: number }) => Promise<void> | void;
  onData: (callback: (data: SshData) => void) => void;
  onError: (callback: (error: SshData) => void) => void;
  onConnected: (
    callback: ({ processId }: { processId: number }) => void,
  ) => void;
  removeListener: (event: string, callback: Function) => void;
  isConnected: () => boolean;
  connect: (config: SSH_CONFIG) => Promise<{
    connected: boolean;
    error: Error | null;
    process: {
      processId: number;
    };
  }>;
  dispose: (processId: number) => Promise<{
    success: boolean;
    processId: number;
  }>;
  activeInstances: () => Promise<number[]>;
}
export interface SftpConnectResult {
  connected: boolean;
  error: Error | null;
}

export interface SftpFile {
  type: "-" | "d" | "l";
  name: string;
  size: number;
  modifyTime: number;
  accessTime: number;
  rights: {
    user: string;
    group: string;
    other: string;
  };
  owner: number;
  group: number;
}

export interface SftpApi {
  connect(config: any): Promise<SftpConnectResult>;
  list(path?: string): Promise<SftpFile[]>;
  dispose(): Promise<void>;
  isConnected(): Promise<boolean>;
  readFile(remotePath: any): Promise<string>;
}

export interface TerminalConfig {
  promptType: PromptType;
  hostname: string;
  currentPath: string;
  username: string;
}

export type TerminalComponentProps = {
  onCommand?: (command: string) => Promise<string>;
  welcomeMessage?: string;
  className?: string;
  config?: Partial<TerminalConfig>;
};

export type SshData = {
  [x: string]: {
    data: string;
  };
};

export type FileItem = {
  index: string;
  isFolder: boolean;
  children: string[];
  name: string;
  data: { content?: string; path: string; sftpFile?: SftpFile };
};
export interface IpcResultSuccess<T = void> {
  success: true;
  data?: T;
  value?: T;
  exists?: boolean;
  files?: string[];
}

export interface IpcResultError {
  success: false;
  error: string;
}

export type IpcResult<T = void> = IpcResultSuccess<T> | IpcResultError;

export interface ElectronStorage {
  setKey(key: string, value: any): Promise<any>;
  getKey(key: string, defaultValue?: any): Promise<any>;
  deleteKey(key: string): Promise<any>;
  clearStore(): Promise<any>;
}

export type TerminalState = "waiting" | "ready" | "executing" | "errored";
