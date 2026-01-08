const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve").default;
const path = require("path");
const { ipcMain } = require("electron");
const Client = require("ssh2-sftp-client");
const { sshManager } = require("./sshManager");
const { sftpManager } = require("./sftpManager");
const { keyValueStorage } = require("./keyValueStorage");
const { dialog } = require("electron");

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    frame: false,

    width: 950,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("minimize", () => win.minimize());
  ipcMain.on("maximize", () =>
    win.isMaximized() ? win.unmaximize() : win.maximize(),
  );
  ipcMain.on("close", () => win.close());

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }

  sshManager.on("data", (data) => {
    win.webContents.send("ssh:data", data);
  });

  sshManager.on("error", (err) => {
    win.webContents.send("ssh:error", err);
  });
  sshManager.on("ready", (data) => {
    win.webContents.send("ssh:ready", data);
  });
  sshManager.on("connected", (data) => {
    win.webContents.send("ssh:connected", data);
  });
  sftpManager.on("close", () => win.webContents.send("sftp:close"));
  sftpManager.on("error", (err) => win.webContents.send("sftp:error", err));
  sftpManager.on("end", () => win.webContents.send("sftp:end"));
  sftpManager.on("ready", () => {
    console.log("SFTP ready");
    win.webContents.send("sftp:ready");
  });
};

ipcMain.on("ssh:write", (_, data) => {
  if (data.cmd === undefined || data.processId === undefined) {
    throw new Error("Data not found");
  }
  sshManager.write(data.cmd, data.processId);
});

ipcMain.handle("ssh:is_connected", () => sshManager.isConnected);
ipcMain.handle("ssh:active_instances", () =>
  Object.values(sshManager.activeInstances).map((e) => e.processId),
);
ipcMain.handle("ssh:dispose", async (_, processId) => {
  return await sshManager.dispose(processId);
});
ipcMain.handle("ssh:connect", async (_, config) => {
  return await sshManager.connect(config);
});
// SFTP CONNECTION
ipcMain.handle("sftp:connect", async (_, config) => {
  return await sftpManager.connect(config);
});
ipcMain.handle("sftp:list", async (_, path) => {
  return await sftpManager.list(path);
});
ipcMain.handle("sftp:write", async (_, data) => {
  try {
    const result = await sftpManager.writeFile(data.path, data.content);
    console.log(result);
    return result;
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      error: error,
    };
  }
});
ipcMain.handle("sftp:dispose", async (_) => {
  return await sftpManager.disconnect();
});

ipcMain.handle("sftp:read_file", async (_, path) => {
  console.log({ path });
  return await sftpManager.readFile(path);
});

ipcMain.handle("sftp:isConnected", async () => {
  return sftpManager.isConnected;
});

ipcMain.handle("storage:saveData", (event, filename, data) => {
  try {
    keyValueStorage.saveData(filename, data);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:readData", (event, filename) => {
  try {
    const data = keyValueStorage.readData(filename);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:deleteData", (event, filename) => {
  try {
    keyValueStorage.deleteData(filename);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:exists", (event, filename) => {
  try {
    const exists = keyValueStorage.exists(filename);
    return { success: true, exists };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:listFiles", () => {
  try {
    const files = keyValueStorage.listFiles();
    return { success: true, files };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:setKey", (event, key, value) => {
  try {
    keyValueStorage.setKey(key, value);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:getKey", (event, key, defaultValue) => {
  try {
    console.log("Getting data");
    const startTime = Date.now();
    const value = keyValueStorage.getKey(key, defaultValue);
    const endTime = Date.now();
    const timeElapsed = endTime - startTime;
    console.log({ seconds: timeElapsed / 1000, key });

    return { success: true, value };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:deleteKey", (event, key) => {
  try {
    keyValueStorage.deleteKey(key);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("storage:clearStore", () => {
  try {
    keyValueStorage.clearStore();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// DIALOG

ipcMain.handle("dialog:showAlert", (_, data) => dialog.showMessageBox(data));

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
