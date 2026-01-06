import { Client } from "ssh2";
import EventEmitter from "events";

class SSHManager extends EventEmitter {
  instanceCount = 0;
  activeInstances = {};

  constructor() {
    super();
  }
  async reconnect(config) {
    return this.connect(config);
  }
  async connect(config) {
    try {
      const ssh = new Client();
      const processId = this.instanceCount;
      this.instanceCount++;
      this.activeInstances[processId.toString()] = {
        ssh: null,
        stream: null,
        isConnected: null,
        processId,
      };
      this.activeInstances[processId.toString()].ssh = ssh;

      this.activeInstances[processId.toString()].ssh.on("ready", () => {
        this.emit("connected", { processId });
        this.startShell(processId);
      });

      this.activeInstances[processId.toString()].ssh.on("error", (err) => {
        this.emit("error", {
          [`${processId}`]: {
            data: err.message,
          },
        });
      });

      ssh.connect(config);
      this.activeInstances[processId.toString()].isConnected = true;
      return {
        connected: true,
        error: null,
        process: {
          processId,
        },
      };
    } catch (error) {
      return { connected: false, error };
    } finally {
    }
  }

  startShell(processId) {
    try {
      const process = this.activeInstances[processId.toString()];
      if (!process.isConnected) throw new Error("Not connected");
      const ssh = process.ssh;
      if (!ssh) {
        throw new Error("Ssh not defined");
      }

      ssh.shell((err, stream) => {
        if (err) return;

        this.activeInstances[processId.toString()].stream = stream;

        stream.on("data", (data) => {
          this.emit("data", {
            [`${processId}`]: {
              data: data?.toString(),
            },
          });
        });

        stream.stderr.on("data", (data) => {
          this.emit("error", {
            [`${processId}`]: {
              data: data?.toString(),
            },
          });
        });

        stream.on("close", () => {
          this.emit("closed", {
            [`${processId}`]: {
              data: "Closed",
            },
          });
          this.emit("error", {
            [`${processId}`]: {
              data: "Connection closed",
            },
          });
        });

        this.emit("ready", {
          processId,
        });
      });
    } catch (error) {
      this.emit("error", {
        [`${processId}`]: {
          data: error?.message,
        },
      });
    }
  }

  dispose(processId) {
    const key = processId?.toString();
    const instance = this.activeInstances[key];

    try {
      const { stream, ssh } = instance;
      if (!instance) {
        throw new Error("Instance not found");
      }

      if (stream) {
        stream.removeAllListeners();
        stream.end();
        stream.destroy();
      }

      if (ssh) {
        ssh.removeAllListeners();
        ssh.end();
        ssh.destroy?.();
      }
      return {
        success: true,
        processId,
      };
    } catch (err) {
      this.emit("error", {
        [`${processId}`]: { data: err.message },
      });
      return {
        success: false,
        processId,
      };
    } finally {
      delete this.activeInstances[key];
      this.emit("disposed", { processId });
    }
  }

  write(command, processId) {
    const stream = this.activeInstances[processId.toString()].stream;
    if (stream) {
      stream.write(`${command} \n`);
      return;
    }
    throw new Error("Stream not found");
  }
}

export const sshManager = new SSHManager();
