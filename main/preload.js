const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
});

contextBridge.exposeInMainWorld("sshApi", {
  write: (cmd) => ipcRenderer.send("ssh:write", cmd),

  onData: (cb) => ipcRenderer.on("ssh:data", (_, data) => cb(data)),

  onError: (cb) => ipcRenderer.on("ssh:error", (_, err) => cb(err)),
  onReady: (cb) => ipcRenderer.on("ssh:ready", (_, data) => cb(data)),

  connect: (config) => ipcRenderer.invoke("ssh:connect", config),
  dispose: (id) => ipcRenderer.invoke("ssh:dispose", id),

  onConnected: (cb) => ipcRenderer.on("ssh:connected", cb),
  activeInstances: () => ipcRenderer.invoke("ssh:active_instances"),
  isConnected: () => ipcRenderer.invoke("ssh:is_connected"),
});

contextBridge.exposeInMainWorld("sftpApi", {
  connect: (config) => ipcRenderer.invoke("sftp:connect", config),
  dispose: () => ipcRenderer.invoke("sftp:dispose"),
  list: (path) => ipcRenderer.invoke("sftp:list", path),
  cwd: () => ipcRenderer.invoke("sftp:cwd"),
  exists: (path) => ipcRenderer.invoke("sftp:exists", path),

  isConnected: () => ipcRenderer.invoke("sftp:isConnected"),
  readFile: (path) => ipcRenderer.invoke("sftp:read_file", path),
  writeFile: (data) => ipcRenderer.invoke("sftp:write", data),
  // Events
  onClose: (fn) => ipcRenderer.on("sftp:close", fn),
  onEnd: (fn) => ipcRenderer.on("sftp:end", fn),
  onReady: (fn) => ipcRenderer.on("sftp:ready", fn),
  onError: (fn) => ipcRenderer.on("sftp:error", (_, err) => fn(err)),
});

contextBridge.exposeInMainWorld("TSConfigApi", {
  parseSourceFileContent: (data) =>
    ipcRenderer.invoke("tsconfig:parse_config_file_content", data),
});

contextBridge.exposeInMainWorld("windowAPI", {
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  close: () => ipcRenderer.send("close"),
});

contextBridge.exposeInMainWorld("dialogApi", {
  showAlert: (options) => ipcRenderer.invoke("dialog:showAlert", options),
});

contextBridge.exposeInMainWorld("electronStorage", {
  saveData: async (filename, data) => {
    const result = await ipcRenderer.invoke("storage:saveData", filename, data);
    if (!result.success) throw new Error(result.error);
    return true;
  },
  readData: async (filename) => {
    const result = await ipcRenderer.invoke("storage:readData", filename);
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  deleteData: async (filename) => {
    const result = await ipcRenderer.invoke("storage:deleteData", filename);
    if (!result.success) throw new Error(result.error);
    return true;
  },
  exists: async (filename) => {
    const result = await ipcRenderer.invoke("storage:exists", filename);
    if (!result.success) throw new Error(result.error);
    return result.exists;
  },
  listFiles: async () => {
    const result = await ipcRenderer.invoke("storage:listFiles");
    if (!result.success) throw new Error(result.error);
    return result.files;
  },

  setKey: async (key, value) => {
    const result = await ipcRenderer.invoke("storage:setKey", key, value);
    if (!result.success) throw new Error(result.error);
    return true;
  },
  getKey: async (key, defaultValue = null) => {
    const result = await ipcRenderer.invoke(
      "storage:getKey",
      key,
      defaultValue,
    );
    if (!result.success) throw new Error(result.error);
    return result.value;
  },
  deleteKey: async (key) => {
    const result = await ipcRenderer.invoke("storage:deleteKey", key);
    if (!result.success) throw new Error(result.error);
    return true;
  },
  clearStore: async () => {
    const result = await ipcRenderer.invoke("storage:clearStore");
    if (!result.success) throw new Error(result.error);
    return true;
  },
});
