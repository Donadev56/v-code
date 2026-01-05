import { SftpApi } from "./types/sftp";

declare global {
  interface Window {
    sftpApi?: SftpApi;
  }
}

export {};
