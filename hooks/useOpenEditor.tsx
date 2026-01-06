"use client";

import {
  ElectronStorage,
  FileItem,
  LOCAL_SSH_CONFIG,
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
import { getKeyFromConfig, GetPath, PROMPT } from "@/lib/utils";
import { toast } from "sonner";

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
  updateFile(path: string): Promise<string | undefined>;
  readFile(path: string): Promise<string | undefined>;
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
  const [config, setConfig] = React.useState<SSH_CONFIG | null>(null);
  const localConfigKey = "local-config-list-0.01";
  const [localConfig, setLocalConfig] = React.useState<{
    [x: string]: {
      config: LOCAL_SSH_CONFIG;
      paths: string[];
    };
  }>({});

  const [isSftpConnected, setIsSftpConnected] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState("");
  const [items, setItems] = React.useState<Record<string, FileItem>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const sftpRef = React.useRef<SftpApi | null>(null);
  console.log({ items });
  console.log(localConfig);
  console.log({ currentPath });

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

  React.useEffect(() => {
    getSavedConfigData().then((result) => {
      if (result) {
        setLocalConfig(result);
        const lastConfig = Object.values(result).sort(
          (a, b) => b.config.updateTime - a.config.updateTime,
        )[0];
        if (lastConfig) {
          setConfig((prev) => ({
            ...prev,
            host: lastConfig.config.host,
            user: lastConfig.config.user,
            port: lastConfig.config.port,
          }));
        }
      }
    });
  }, []);

  async function updateLocalConfig(config: SSH_CONFIG) {
    const localConfig: LOCAL_SSH_CONFIG = {
      user: config.user,
      host: config.host,
      port: config.port,
      updateTime: Number((Date.now() / 1000).toFixed(0)),
    };
    let localData: {
      [x: string]: {
        config: LOCAL_SSH_CONFIG;
        paths: string[];
      };
    } = {};
    const key = getKeyFromConfig(localConfig);
    const savedData = await getSavedConfigData();
    if (savedData) {
      localData = savedData;
    }

    localData[key] = {
      config: { ...localData[key]?.config, ...localConfig },
      paths: localData[key]?.paths,
    };
    saveData(localData);
  }
  async function addPath(key: string, path: string) {
    let localData: {
      [x: string]: {
        config: LOCAL_SSH_CONFIG;
        paths: string[];
      };
    } = {};

    const savedData = await getSavedConfigData();
    if (savedData) {
      localData = savedData;
    }
    if (!localData[key]?.paths) {
      localData[key].paths = [];
    }

    localData[key].paths.push(path);
    localData[key].paths = Array.from(new Set(localData[key].paths));

    saveData(localData);
  }
  async function saveData(data: any) {
    if (typeof window === "undefined") {
      return;
    }
    const st = window?.electronStorage as ElectronStorage;
    if (!st) {
      throw new Error("Storage not found");
    }
    setLocalConfig(data);

    await st.setKey(localConfigKey, JSON.stringify(data));
  }

  async function getSavedConfigData() {
    try {
      if (typeof window === "undefined") {
        return;
      }
      const st = window?.electronStorage as ElectronStorage;
      if (!st) {
        throw new Error("Storage not found");
      }
      const result = await st.getKey(localConfigKey);
      if (result) {
        return JSON.parse(result) as {
          [x: string]: {
            config: LOCAL_SSH_CONFIG;
            paths: string[];
          };
        };
      }
      return {};
    } catch (error) {
      console.error({ error });

      return {};
    }
  }

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

  const connect = async (config: SSH_CONFIG) => {
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
      await addConnection(config);
    } catch (error) {
      console.error((error as any).message);
    }
  };

  const connectSftp = async (config: SSH_CONFIG) => {
    try {
      updateLocalConfig(config);

      if (typeof window === "undefined") {
        return;
      }
      const sftp = (window as any).sftpApi as SftpApi;
      if (sftp) {
        sftpRef.current = sftp;

        const result = await sftp.connect(config);
        if (result.error) {
          throw result.error;
        }
        setIsSftpConnected(true);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to connect", {
        description: (error as any)?.message || String(error),
      });
    }
  };

  async function addConnection(conf = config) {
    try {
      if (!conf) {
        throw new Error("Config not defined");
      }
      if (typeof window === "undefined") {
        throw new Error("Window not defined");
      }
      const sshApi = (window as any).sshApi as SSHApi;

      if (!sshApi) {
        throw new Error("Api not loaded");
      }
      const result = await sshApi.connect(conf);
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

  async function connectServer() {
    try {
      setIsLoading(true);
      if (!config) {
        throw new Error("Config not found");
      }
      const conf = { ...config, port: Number(config?.port) };
      if (config) {
        await Promise.all([connect(conf), connectSftp(conf)]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

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

  async function openPath(path: string) {
    try {
      setIsLoading(true);
      const files = await getPathFiles(path);
      if (files) {
        setItems(files);
      }
      setCurrentPath(path);
      const key = getKeyFromConfig(config!);
      addPath(key, path);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateFile(path: string) {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      console.log({ path });
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
            data: { sftpFile: item, path: GetPath(path, item.name) },
            name: item.name,
          };
        }
      }
      return files;
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message ?? String(error));
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
    config,
    setConfig,
    localConfig,
    setLocalConfig,
    connectServer,
    isLoading,
    setIsLoading,
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
