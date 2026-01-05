"use client";

import {
  FileItem,
  OpenedFile,
  SftpApi,
  SSH_CONFIG,
  SSHApi,
  TerminalState,
} from "@/types/types";
import React, { useRef } from "react";
import { createContext, useContext, useState, ReactNode } from "react";
import Client from "ssh2-sftp-client";
import { Terminal } from "@xterm/xterm";
import { GetPath, PROMPT } from "@/lib/utils";

interface OpenEditorContextType {
  focusedFile: OpenedFile;
  setFocusedFile: React.Dispatch<React.SetStateAction<OpenedFile>>;
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
  connect: () => void;
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
  openPath(): Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<Record<string, FileItem>>>;
  items: Record<string, FileItem>;
  updateFile(path: string): Promise<string | undefined>;
  readFile(path: string): Promise<string | undefined>;
  getPathFiles(path: string): Promise<Record<string, FileItem> | undefined>;
}

const OpenEditorContext = createContext<OpenEditorContextType | undefined>(
  undefined,
);

export function OpenEditorProvider({ children }: { children: ReactNode }) {
  const [focusedFile, setFocusedFile] = React.useState<OpenedFile>({
    name: "",
    content: "",
    path: "",
  });
  const [isTerminalVisible, setIsTerminalVisible] = React.useState(false);
  const [sshConfig, setSshConfig] = React.useState<SSH_CONFIG | null>();
  const [isSftpConnected, setIsSftpConnected] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState("");
  const [items, setItems] = React.useState<Record<string, FileItem>>({});
  const sftpRef = React.useRef<SftpApi | null>(null);
  console.log({ items });

  const [terminalState, setTerminalState] = useState<{
    [x: string]: {
      isConnected: boolean;
      state: TerminalState;
    };
  }>({});

  const [terminal, setTerminal] = React.useState<{
    [x: string]: Terminal;
  }>({});
  const [activeTerminalIds, setActiveTerminalIds] = React.useState<number[]>(
    [],
  );

  const defaultConfig = {
    host:process.env.host!,
    user: process.env.user!,
    port:Number(process.env.port!),
    password: process.env.password!,
  };

  function onConnected(processId: number) {
    const term = terminal[processId.toString()];
    setTerminalState((prev) => ({
      ...prev,
      [`${processId}`]: {
        isConnected: true,
        state: "ready",
      },
    }));
    if (!term) return;

    term.writeln("\r\n✅ SSH connected successfully");
    term.write(PROMPT);
  }

  const connect = async () => {
    const sshApi = (window as any).sshApi as SSHApi;

    if (!sshApi) {
      throw new Error("Api not loaded");
    }
    const actives = await sshApi.activeInstances();
    if (actives.length > 0) {
      setActiveTerminalIds(actives);
      return;
    }
    console.log("Connecting ssh...");
    try {
      await addConnection(defaultConfig);
    } catch (error) {
      console.error((error as any).message);
    }
  };

  const connectSftp = async (config = defaultConfig) => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      const sftp = (window as any).sftpApi as SftpApi;
      if (sftp) {
        if (await sftp.isConnected()) {
          throw new Error("Already connected");
        }
        sftpRef.current = sftp;

        const result = await sftp.connect(config);
        if (result.error) {
          throw result.error;
        }
        setIsSftpConnected(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function addConnection(config: SSH_CONFIG = defaultConfig) {
    try {
      if (typeof window === "undefined") {
        throw new Error("Window not defined");
      }
      const sshApi = (window as any).sshApi as SSHApi;

      if (!sshApi) {
        throw new Error("Api not loaded");
      }
      const result = await sshApi.connect(config);
      if (result) {
        if (
          result?.error?.message === "Already connected" ||
          result.connected
        ) {
          setActiveTerminalIds((prev) => [...prev, result.process.processId]);
          setTerminalState((prev) => ({
            ...prev,
            [`${result.process.processId}`]: {
              isConnected: true,
              state: "ready",
            },
          }));

          const term = terminal[result.process.processId.toString()];
          term?.writeln("Connected to SSH.");
        } else {
          throw result.error;
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  React.useEffect(() => {
    connect();
    connectSftp();
  }, []);

  function addTerminal(terminal: Terminal, processId: number) {
    setTerminal((prev) => ({ ...prev, [processId.toString()]: terminal }));
  }

  async function deleteTerminal(processId: number) {
    try {
      const sshApi = (window as any).sshApi as SSHApi;

      if (!sshApi) {
        throw new Error("Api not loaded");
      }
      const result = await sshApi.dispose(processId);
      if (result.success) {
        setActiveTerminalIds((prev) => prev.filter((e) => e !== processId));
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function openPath() {
    try {
      const files = await getPathFiles(currentPath);
      if (files) {
        setItems(files);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateFile(path: string) {
    try {
      const data = await readFile(path);
      if (data) {
        setItems((prev) => {
          const targetFile = Object.values(items).find(
            (e) => e.data.path === path,
          );
          if (targetFile) {
            return {
              ...prev,
              [targetFile.name]: {
                ...prev[targetFile.name],
                data: { ...prev[targetFile.name].data, content: data },
              },
            };
          }
          return prev;
        });

        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function readFile(path: string) {
    try {
      const sftp = sftpRef.current;
      if (!sftp) {
        return;
      }
      const result = await sftp.readFile(path);
      if (result) {
        return result;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getPathFiles(path: string) {
    try {
      const sftp = sftpRef.current;
      if (!sftp) {
        return;
      }
      const data = await sftp.list(path);
      const files: Record<string, FileItem> = {};

      if (data) {
        files["root"] = {
          index: "root",
          isFolder: true,
          children: data.map((e) => e.name),
          name: "root",
          data: { path: "" },
        };

        for (const item of data) {
          const key = item.name;

          files[key] = {
            index: item.name,
            isFolder: item.type === "d",
            children: [],
            data: { sftpFile: item, path: GetPath(currentPath, item.name) },
            name: item.name,
          };
        }
      }
      return files;
    } catch (error) {
      console.error(error);
    }
  }

  const state: OpenEditorContextType = {
    items,
    setItems,
    addConnection,
    focusedFile,
    setFocusedFile,
    isTerminalVisible,
    setIsTerminalVisible,
    terminalState,
    setTerminalState,
    connect,
    addTerminal,
    terminal,
    onConnected,
    activeTerminalIds,
    deleteTerminal,
    isSftpConnected,
    setCurrentPath,
    currentPath,
    openPath,
    getPathFiles,
    readFile,
    updateFile,
  };

  return (
    <OpenEditorContext.Provider value={state}>
      {children}
    </OpenEditorContext.Provider>
  );
}

export function useOpenEditor() {
  const context = useContext(OpenEditorContext);
  if (context === undefined) {
    throw new Error("useOpenEditor must be used within an OpenEditorProvider");
  }
  return context;
}
