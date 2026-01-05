const SftpClient = require("ssh2-sftp-client");
const { Client } = require("ssh2");
const path = require("path");

class SSHManager {
  config = null;

  constructor() {
    this.client = null;
    this.isSftpConnected = false;
    this.isSshConnected = false;
    this.ssh = null;
    this.currentDir = "";
  }

  setConfig(config) {
    this.config = config;
    return this.config;
  }

  async connect() {
    await this._connectSsh(this.config);
    await this._connectSftp(this.config);
    return true;
  }

  async _connectSftp(config) {
    if (this.isSftpConnected) return "Already conncted";
    this.sftp = new SftpClient();
    await this.sftp.connect(config);
    this.isSftpConnected = true;
    return "SFPT connected";
  }

  async _connectSsh(config) {
    console.log("Connecting ssh...");

    if (this.isSshConnected) return "Already conncted";
    this.ssh = new Client();

    await new Promise((resolve, reject) => {
      this.ssh.on("ready", resolve).on("error", reject).connect(config);
    });

    this.isSshConnected = true;
    const result = await this.executeCmd("ls");
    if (result.error) throw new Error(result.error);
    this.currentDir = result.output.trim();
    console.log("Current dir", this.currentDir);

    return "SSH connected";
  }

  async list(path = "/") {
    if (!this.isSftpConnected) throw new Error("Not connected");
    return await this.sftp.list(path);
  }

  isCd(cmd) {
    return cmd.startsWith("cd ");
  }

  async exec(command) {
    if (this.isCd(command)) {
      const target = command.replace("cd ", "");
      this.currentDir = path.resolve(this.currentDir, target);
    }

    if (!this.isSshConnected) throw new Error("Not connected");
    const cmd = `cd ${this.currentDir} && ${command}`;
    console.log({ cmd });

    return this.executeCmd(cmd);
  }

  async executeCmd(cmd) {
    if (!this.isSshConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      this.ssh.exec(cmd, (err, stream) => {
        if (err) return reject(err);

        let output = "";
        let error = "";

        stream
          .on("data", (data) => (output += data.toString()))
          .stderr.on("data", (data) => (error += data.toString()));

        stream.on("close", () => {
          resolve({ output, error });
        });
      });
    });
  }

  async disconnect() {
    if (this.ssh) this.ssh.end();
    if (this.sftp) await this.sftp.end();
    this.isSftpConnected = false;
    this.isSftpConnected = false;
  }
}

module.exports = new SSHManager();
