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
  setConfig: (config) => ipcRenderer.invoke("ssh:set_config", config),
  connect: () => ipcRenderer.invoke("ssh:connect"),
  list: (path) => ipcRenderer.invoke("ssh:list", path),
  disconnect: () => ipcRenderer.invoke("ssh:disconnect"),
  exec: (cmd) => ipcRenderer.invoke("ssh:exec", cmd),
});
