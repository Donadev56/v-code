import fs from "fs";
import path from "path";
import os from "os";

export class ElectronKeyValueStorage {
  constructor(fileName = "electron-local-main-storage.json") {
    this.filePath = path.join(os.homedir(), fileName);

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}), "utf8");
    }
  }

  _readStore() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  }

  _writeStore(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  setKey(key, value) {
    const store = this._readStore();
    store[key] = value;
    this._writeStore(store);
  }

  getKey(key, defaultValue = null) {
    const store = this._readStore();
    return store.hasOwnProperty(key) ? store[key] : defaultValue;
  }

  deleteKey(key) {
    const store = this._readStore();
    if (store.hasOwnProperty(key)) {
      delete store[key];
      this._writeStore(store);
    }
  }

  exists(key) {
    const store = this._readStore();
    return store.hasOwnProperty(key);
  }

  clearStore() {
    this._writeStore({});
  }

  getAll() {
    return this._readStore();
  }
}

// Export the storage instance
export const keyValueStorage = new ElectronKeyValueStorage();
