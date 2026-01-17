import { DialogApi } from "@/types/types";
import { SftpApi, ElectronStorage } from "./types/sftp";

declare global {
  interface Window {
    sftpApi: SftpApi;
    electronStorage: ElectronStorage;
    dialogApi: DialogApi;
  }
}

export {};
