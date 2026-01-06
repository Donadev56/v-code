import SftpClient from "ssh2-sftp-client";
import path from "path";

class SFTPManager {
  constructor() {
    this.isConnected = false;
    this.sftp = null;
  }

  async connect(config) {
    try {
      this.sftp = new SftpClient();
      await this.sftp.connect(config);
      this.isConnected = true;
      return { connected: true, error: null };
    } catch (error) {
      return { error, connected: false };
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
