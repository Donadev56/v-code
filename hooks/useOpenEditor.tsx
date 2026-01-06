"use client";

import {
  buf,
  ElectronStorage,
  FileContent,
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
import {
  getKeyFromConfig,
  GetPath,
  ParseFile,
  PROMPT,
  StringifyFile,
} from "@/lib/utils";
import { toast } from "sonner";
import { toString } from "uint8arrays/to-string";
import { fromString } from "uint8arrays/from-string";

interface OpenEditorContextType {
  focusedFile: OpenedFile | null;
  setFocusedFile: React.Dispatch<React.SetStateAction<OpenedFile | null>>;
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
}

const OpenEditorContext = createContext<OpenEditorContextType | undefined>(
  undefined,
);

export function OpenEditorProvider({ children }: { children: ReactNode }) {
  const [focusedFile, setFocusedFile] = React.useState<OpenedFile | null>(null);
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
  const [openedFiles, setOpenedFiles] = React.useState<{
    [name: string]: OpenedFile;
  }>({});
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

  const openedFileKeyBase = "local:opened:v0.05:file:for:";
  const focusFileKeyBase = "local:focus:file:v0.05:file:for:";

  const localOpenedFileKey = React.useMemo(() => {
    return `${openedFileKeyBase}${currentPath}`;
  }, [currentPath]);
  const localItemsFileKey = React.useMemo(() => {
    return `local:items:file:for:${currentPath}`;
  }, [currentPath]);

  const listenerRegistered = React.useRef(false);

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

  React.useEffect(() => {
    saveOpenedFiles();
    const openedFilesList = Object.values(openedFiles);
    if (openedFilesList.length > 0 && !focusedFile) {
      setFocusedFile(openedFilesList[0]);
    }
  }, [openedFiles, currentPath]);

  React.useEffect(() => {
    saveFocusedFile();
  }, [focusedFile]);

  React.useEffect(() => {
    saveItems();
  }, [items, currentPath]);

  React.useEffect(() => {
    if (listenerRegistered.current) {
      return;
    }
    listenerRegistered.current = true;
    const sftp = sftpRef.current;

    if (sftp) {
      sftp.onClose(onClose);

      sftp.onEnd(onClose);

      sftp.onError((error) => {
        toast.error(error);
      });

      sftp.onReady(onReady);
    }

    return () => {
      sftp?.dispose();
    };
  }, [sftpRef.current]);

  function onReady() {
    console.log("SFTP server ready");
    toast.success("Connection established");
    const lastConfig = Object.values(localConfig).sort(
      (a, b) => b.config.updateTime - a.config.updateTime,
    )[0];

    if (lastConfig) {
      openPath(lastConfig.paths[0]);
    }
  }

  function onClose() {
    () => {
      toast.error("SFTP closed");

      setTimeout(() => {
        toast.promise(_attemptReconnect, {
          loading: "Trying to reconnect",
        });
      }, 2500);
    };
  }

  async function _attemptReconnect() {
    try {
      if (!config) {
        throw new Error("Config not found");
      }
      await connectSftp(config);
    } catch (error) {
      console.error({ error });
      toast.error("Failed to save opened files", {
        description: (error as any)?.message || String(error),
      });
    }
  }
  async function saveItems() {
    try {
      if (Object.values(items).length === 0) {
        return;
      }
      if (currentPath.trim().length === 0) {
        return;
      }
      console.log("Saving items....");
      await saveData(StringifyFile(items), localItemsFileKey);
    } catch (error: any) {
      console.error(error?.message);
      toast.error("Failed to save opened files", {
        description: (error as any)?.message || String(error),
      });
    }
  }

  async function saveFocusedFile() {
    try {
      if (!focusedFile) {
        return;
      }
      if (currentPath.trim().length === 0) {
        return;
      }
      console.log("Saving files....");
      const key = `${focusFileKeyBase}:${currentPath}`;

      await saveData(StringifyFile(focusedFile), key);
    } catch (error: any) {
      console.error(error?.message);
      toast.error("Failed to save focus files", {
        description: (error as any)?.message || String(error),
      });
    }
  }

  async function saveOpenedFiles() {
    try {
      if (Object.values(openedFiles).length === 0) {
        return;
      }
      if (currentPath.trim().length === 0) {
        return;
      }
      const key = `${openedFileKeyBase}:${currentPath}`;

      console.log("Saving files....");

      await saveData(StringifyFile(openedFiles), key);
    } catch (error: any) {
      console.error(error?.message);
      toast.error("Failed to save opened files", {
        description: (error as any)?.message || String(error),
      });
    }
  }

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
    saveData(JSON.stringify(localData), localConfigKey);
    setLocalConfig(localData);
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

    localData[key].paths = [path, ...localData[key].paths];
    localData[key].paths = Array.from(new Set(localData[key].paths));

    saveData(JSON.stringify(localData), localConfigKey);
    setLocalConfig(localData);
  }
  async function saveData(data: string, key: string) {
    if (typeof window === "undefined") {
      return;
    }
    const st = window?.electronStorage as ElectronStorage;
    if (!st) {
      throw new Error("Storage not found");
    }

    await st.setKey(key, data);
  }

  async function getSavedConfigData() {
    try {
      const result = await getData(localConfigKey);
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

  async function getData(key: string) {
    try {
      if (typeof window === "undefined") {
        return;
      }
      const st = window?.electronStorage as ElectronStorage;
      if (!st) {
        throw new Error("Storage not found");
      }
      const result = await st.getKey(key);
      return result;
    } catch (error) {
      console.error({ error });
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
        afterConnection();
      }
    } catch (error: any) {
      console.error({ error });
      toast.error("Failed to connect", {
        description: (error as any)?.message || String(error),
      });
    }
  };

  function afterConnection() {
    onReady();
  }

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
      console.error({ error });
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
    } catch (error: any) {
      console.error(error?.message);
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
      console.error({ error });
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
      setOpenedFiles({});

      loadSavedData(path);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSavedData(path: string) {
    try {
      const focusedFileKey = `${focusFileKeyBase}:${path}`;
      const openedFileKey = `${openedFileKeyBase}:${path}`;

      const [oFilesString, focusFileString] = await Promise.all([
        getData(openedFileKey),
        getData(focusedFileKey),
      ]);

      console.log({ oFilesString, focusFileString });

      if (oFilesString) {
        const parsed = ParseFile(oFilesString) as {
          [name: string]: OpenedFile;
        };
        setOpenedFiles((prev) => {
          if (Object.values(prev).length > 0) {
            return prev;
          }
          return parsed;
        });
      }

      if (focusFileString) {
        const parsed = ParseFile(focusFileString) as OpenedFile;
        setFocusedFile(parsed);
      }
    } catch (error) {
      console.error({ error });
    }
  }

  async function updateFile(path: string, silent = false) {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const data = await readFile(path);
      if (data) {
        setItems((prev) => {
          return {
            ...prev,
            [path]: {
              ...prev[path],
              data: { ...prev[path].data, content: data },
            },
          };
        });

        return data;
      }
    } catch (error) {
      console.error({ error });
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
      console.log({ result });
      if (result) {
        return result;
      }
    } catch (error) {
      console.error({ error });
    }
  }

  async function getPathFiles(path: string) {
    try {
      console.log({ path });
      const sftp = sftpRef.current;
      if (!sftp) {
        return;
      }
      let data = await sftp.list(path);

      const sortedData = [...data].sort((a, b) => {
        if (a.type === "d" && b.type !== "d") return -1;
        if (a.type !== "d" && b.type === "d") return 1;

        return a.name.localeCompare(b.name);
      });
      data = sortedData;
      const files: Record<string, FileItem> = {};

      if (data) {
        files["root"] = {
          index: "root",
          isFolder: true,
          children: data.map((e) => GetPath(path, e.name)),
          name: "root",
          data: { path: "" },
        };

        for (const item of data) {
          const fullPath = GetPath(path, item.name);

          files[fullPath] = {
            index: fullPath,
            isFolder: item.type === "d",
            children: [],
            data: { sftpFile: item, path: fullPath, name: item.name },
            name: item.name,
          };
        }
      }
      return files;
    } catch (error: any) {
      if (error?.message === "read ECONNRESET") {
        setIsSftpConnected(false);
        if (config) connectSftp(config);
      }
      console.error(error?.message);
      toast.error((error as any)?.message ?? String(error));
    }
  }

  async function updateFolder(path: string) {
    const file = Object.values(items).find((e) => e.data.path === path);
    if (!file?.children || file?.children?.length === 0) {
      setIsLoading(true);
    }

    try {
      const files = await getPathFiles(path);
      if (files) {
        const children = files["root"].children;
        delete files["root"];

        setItems((prev) => {
          if (file) {
            return {
              ...prev,
              ...files,
              [file.data.path]: {
                ...prev[file.data.path],
                children,
              },
            };
          } else {
            console.log("File not found");
          }

          return prev;
        });
      }
    } catch (error) {
      console.error({ error });
      toast.error((error as any)?.message ?? String(error));
    } finally {
      setIsLoading(false);
    }
  }

  const state: OpenEditorContextType = {
    openedFiles,
    setOpenedFiles,
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
    updateFolder,
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
