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
  isConnected: () => ipcRenderer.invoke("sftp:isConnected"),
  readFile: (path) => ipcRenderer.invoke("sftp:read_file", path),
});

contextBridge.exposeInMainWorld("windowAPI", {
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  close: () => ipcRenderer.send("close"),
});
