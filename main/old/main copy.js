const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const { ipcMain } = require("electron");
const Client = require("ssh2-sftp-client");
const sshManager = require("../sshManager");

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 950,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

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
};

ipcMain.handle("ssh:set_config", (_, config) => {
  return sshManager.setConfig(config);
});
ipcMain.handle("ssh:exec", async (_, cmd) => {
  return await sshManager.exec(cmd);
});
ipcMain.handle("ssh:connect", async (_) => {
  return await sshManager.connect();
});

ipcMain.handle("ssh:list", async (_, path) => {
  return await sshManager.list(path);
});

ipcMain.handle("ssh:disconnect", async () => {
  await sshManager.disconnect();
  return "Disconnceted";
});

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
