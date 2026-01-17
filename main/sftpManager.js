import SftpClient from "ssh2-sftp-client";
import path from "path";
import EventEmitter from "events";
import os from "os";
import fs from "fs/promises";
import { v4 } from "uuid";

class SFTPManager extends EventEmitter {
  constructor() {
    super();
    this.isConnected = false;
    this.sftp = null;
    this.tempFilePath = path.join(os.homedir(), "unsaved_temp_files.json");
  }

  async connect(config) {
    try {
      this.sftp = new SftpClient();

      this.sftp.on("close", () => {
        this.emit("close");
        this.isConnected = false;
      });

      this.sftp.on("end", () => {
        console.warn("SFTP connection ended");
        this.emit("end");
        this.isConnected = false;
      });

      this.sftp.on("error", (err) => {
        console.error("SFTP error:", err);
        this.emit("error", err);
        this.isConnected = false;
      });
      await this.sftp.connect({ ...config, timeout: 30_000 });
      this.emit("ready");

      this.isConnected = true;
      return { connected: true, error: null };
    } catch (error) {
      return { error, connected: false };
    }
  }
  async writeFile(remotePath, content) {
    try {
      if (!this.isConnected) throw new Error("Not connected");

      const tmpLocal = path.join(os.tmpdir(), path.basename(remotePath));
      const id = v4();
      const time = Date.now();

      await fs.writeFile(tmpLocal, content);

      let savedData = (await this._readStore(this.tempFilePath)) ?? [];

      savedData = [...savedData, { remotePath, tmpLocal, time, id }];
      this._writeStore(this.tempFilePath, savedData);

      const message = await this.sftp.fastPut(tmpLocal, remotePath);

      savedData = (await this._readStore(this.tempFilePath)) ?? [];
      await this._writeStore(
        this.tempFilePath,
        savedData.filter((e) => e.id !== id),
      );

      await fs.unlink(tmpLocal);

      return { success: true, error: null, message };
    } catch (error) {
      return { success: false, error, message: null };
    }
  }

  async list(path = "/") {
    if (!this.isConnected) throw new Error("Not connected");
    return await this.sftp.list(path);
  }
  async cwd() {
    if (!this.isConnected) throw new Error("Not connected");
    return await this.sftp.cwd();
  }

  async disconnect() {
    if (this.sftp) {
      await this.sftp.end();
    }
    this.isConnected = false;
  }

  async readFile(remotePath) {
    if (!remotePath) {
      throw new Error("Path not defined");
    }

    if (!this.isConnected) throw new Error("Not connected");
    const buffer = await this.sftp.get(remotePath);

    return buffer;
  }

  async _readStore(path) {
    try {
      const data = await fs.readFile(path, "utf8");
      return JSON.parse(data);
    } catch (err) {}
  }

  async _writeStore(path, data) {
    return await fs.writeFile(path, JSON.stringify(data, null, 2), "utf8");
  }
}

export const sftpManager = new SFTPManager();
