import { SftpApi, ElectronStorage } from "./types/sftp";

declare global {
  interface Window {
    sftpApi?: SftpApi;
    electronStorage: ElectronStorage;
  }
}

export {};
