import Store from "electron-store";

class ElectronStorage {
  constructor() {
    this.store = new Store({
      name: "electron-local-storage",
    });
  }

  setKey(key, value) {
    this.store.set(key, value);
  }

  getKey(key, defaultValue = null) {
    return this.store.get(key, defaultValue);
  }

  deleteKey(key) {
    this.store.delete(key);
  }

  exists(key) {
    return this.store.has(key);
  }

  clearStore() {
    this.store.clear();
  }

  getAll() {
    return this.store.store;
  }
}

export const storageManager = new ElectronStorage();
