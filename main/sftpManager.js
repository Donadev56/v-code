import SftpClient from "ssh2-sftp-client";
import path from "path";
import EventEmitter from "events";
import os from "os";
import fs from "fs/promises";

class SFTPManager extends EventEmitter {
  constructor() {
    super();
    this.isConnected = false;
    this.sftp = null;
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
      await this.sftp.connect(config);
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

      await fs.writeFile(tmpLocal, content);

      const remoteTmp = 
      
      `${remotePath}.tmp`;

      await this.sftp.put(tmpLocal, remoteTmp);
      await this.sftp.delete(remotePath);
      await this.sftp.rename(remoteTmp, remotePath);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  }

  async list(path = "/") {
    if (!this.isConnected) throw new Error("Not connected");
    return await this.sftp.list(path);
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
}

export const sftpManager = new SFTPManager();
