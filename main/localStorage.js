import fs from "fs";
import os from "os";
import path from "path";

class ElectronStorage {
  constructor() {
    this.dataPath = path.join(os.homedir(), ".opennode-virtual-code");
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
    this.personalStorageKey = "store.json";
  }

  saveData(filename, data) {
    if (filename === this.personalStorageKey) {
      throw new Error("Personal name taken");
    }
    const filePath = path.join(this.dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  readData(filename) {
    const filePath = path.join(this.dataPath, filename);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    try {
      return JSON.parse(content);
    } catch (err) {
      console.error("Error parsing JSON from : " + filename, err);
      return null;
    }
  }

  deleteData(filename) {
    const filePath = path.join(this.dataPath, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  exists(filename) {
    const filePath = path.join(this.dataPath, filename);
    return fs.existsSync(filePath);
  }

  listFiles() {
    return fs.readdirSync(this.dataPath);
  }

  setKey(key, value) {
    const store = this.readData(this.personalStorageKey) || {};
    store[key] = value;
    this.saveData(this.personalStorageKey, store);
  }

  getKey(key, defaultValue = null) {
    const store = this.readData(this.personalStorageKey) || {};
    return store[key] ?? defaultValue;
  }

  deleteKey(key) {
    const store = this.readData(this.personalStorageKey) || {};
    delete store[key];
    this.saveData(this.personalStorageKey, store);
  }

  clearStore() {
    this.saveData(this.personalStorageKey, {});
  }
}

export const storageManager = new ElectronStorage();
