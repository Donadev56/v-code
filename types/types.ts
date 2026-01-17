import ELectron from "electron";
export type FileSavedState = "SAVED" | "UNSAVED";
export type OpenedFile = {
  name: string;
  path: string;
  content: FileContent;
  state: FileSavedState;
};

export type FocusedFileType = {
  name: string;
  path: string;
  content: FileContent;
};
import { Terminal } from "@xterm/xterm";

export type FileContent = Uint8Array;

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
  onReady: (callback: (data: { processId: number }) => void) => void;
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
  readFile(remotePath: any): Promise<FileContent>;
  onReady: (callback: () => void) => void;
  onClose: (callback: () => void) => void;
  onEnd: (callback: () => void) => void;
  onError: (callback: (error: any) => void) => void;
  writeFile: (data: {
    path: string;
    content: FileContent;
  }) => Promise<{ success: boolean; error: any }>;
  cwd(): Promise<string>;
}
export interface DialogApi {
  showAlert: (
    options: Electron.MessageBoxOptions,
  ) => Promise<Electron.MessageBoxReturnValue>;
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
  data: {
    content?: FileContent;
    path: string;
    sftpFile?: SftpFile;
    name?: string;
  };
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
export const buf = Buffer.alloc(0);

export type FileRendererType = {
  file: FocusedFileType;
  updateFileContent({
    file,
    newValue,
  }: {
    file: FocusedFileType;
    newValue: string | undefined;
  }): void;
};

export type SupportedFileType = "image" | "pdf" | "text";
export interface OpenEditorContextType {
  focusedFile: FocusedFileType | null;
  setFocusedFile: React.Dispatch<React.SetStateAction<FocusedFileType | null>>;
  isTerminalVisible: boolean;
  setIsTerminalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  terminalState: {
    [x: string]: {
      isConnected: boolean;
      state: TerminalState;
    };
  };
  setTerminalState: React.Dispatch<
    React.SetStateAction<{
      [x: string]: {
        isConnected: boolean;
        state: TerminalState;
      };
    }>
  >;
  terminal: {
    [x: string]: Terminal;
  };
  addTerminal(terminal: Terminal, processId: number): void;
  onConnected: (processId: number) => void;
  activeTerminalIds: number[];
  addConnection(config?: SSH_CONFIG): Promise<{
    connected: boolean;
    error: Error | null;
    process: {
      processId: number;
    };
  }>;
  deleteTerminal(processId: number): Promise<{
    success: boolean;
    processId: number;
  }>;
  isSftpConnected: boolean;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  currentPath: string;
  openPath(path: string): Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<Record<string, FileItem>>>;
  items: Record<string, FileItem>;
  updateFile(path: string, silent?: boolean): Promise<FileContent | undefined>;
  readFile(path: string): Promise<FileContent | undefined>;
  getPathFiles(path: string): Promise<Record<string, FileItem> | undefined>;
  config: SSH_CONFIG | null;
  setConfig: React.Dispatch<React.SetStateAction<SSH_CONFIG | null>>;
  connectServer: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  localConfig: {
    [x: string]: {
      config: LOCAL_SSH_CONFIG;
      paths: string[];
    };
  };
  setLocalConfig: React.Dispatch<
    React.SetStateAction<{
      [x: string]: {
        config: LOCAL_SSH_CONFIG;
        paths: string[];
      };
    }>
  >;
  updateFolder(path: string): Promise<void>;
  openedFiles: {
    [name: string]: OpenedFile;
  };
  setOpenedFiles: React.Dispatch<
    React.SetStateAction<{
      [name: string]: OpenedFile;
    }>
  >;

  lastFileVersion: {
    [x: string]: FileContent;
  };
  setLastFileVersion: React.Dispatch<
    React.SetStateAction<{
      [x: string]: FileContent;
    }>
  >;
  writeFile({
    file,
    newValue,
  }: {
    file: {
      path: string;
      content: FileContent;
    };
    newValue: string | undefined;
  }): Promise<
    | {
        success: boolean;
        error: any;
      }
    | undefined
  >;
  setLastEditTime: React.Dispatch<React.SetStateAction<number>>;
  lastEditTime: number;
  setTimeWithoutTyping: React.Dispatch<React.SetStateAction<number>>;
  timeWithoutTyping: number;
  attemptReconnect(): Promise<void>;
}
