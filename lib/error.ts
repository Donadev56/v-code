import { FileContent, SSH_CONFIG } from "@/types/types";
export async function onError(error: any) {
  if (typeof window === "undefined") {
    return;
  }
  console.error({ error });
  const dialog = window.dialogApi;
  if (dialog) {
    await dialog.showAlert({
      type: "error",
      title: "Error",
      message: error?.message || String(error),
      buttons: ["Cancel"],
      cancelId: 0,
    });
  }
}
type WriteFileParams = {
  file: {
    path: string;
    content: FileContent;
  };
  newValue: string | undefined;
};
export async function onWriteFileError(
  error: any,
  data: WriteFileParams,
  callback: (data: WriteFileParams) => Promise<any>,
) {
  if (typeof window === "undefined") {
    return;
  }
  console.error({ error });
  const dialog = window.dialogApi;
  if (dialog) {
    const result = await dialog.showAlert({
      type: "error",
      title: "Error while saving file",
      message: error?.message || String(error),
      buttons: ["Cancel", "Try again"],
      defaultId: 1,
      cancelId: 0,
    });
    if (result.response === 1) {
      setTimeout(() => {
        callback(data);
      }, 2500);
    }
  }
}
export async function onSftpError(error: any, callback: () => Promise<void>) {
  if (typeof window === "undefined") {
    return;
  }
  console.error({ error });
  const dialog = window.dialogApi;
  if (dialog) {
    const result = await dialog.showAlert({
      type: "error",
      title: "SFTP closed",
      message: error?.message || String(error),
      buttons: ["Cancel", "Reconnect"],
      defaultId: 1,
      cancelId: 0,
    });
    if (result.response === 1) {
      setTimeout(() => {
        callback();
      }, 2500);
    }
  }
}
export async function onSftpConnectionError(
  error: any,
  config: SSH_CONFIG,
  callback: (config: SSH_CONFIG) => Promise<void>,
) {
  if (typeof window === "undefined") {
    return;
  }
  console.error({ error });
  const dialog = window.dialogApi;
  if (dialog) {
    const result = await dialog.showAlert({
      type: "error",
      title: "Failed to connect",
      message: error?.message || String(error),
      buttons: ["Cancel", "Reconnect"],
      defaultId: 1,
      cancelId: 0,
    });
    if (result.response === 1) {
      setTimeout(() => {
        callback(config);
      }, 2500);
    }
  }
}
export async function onReadFileError(
  error: any,
  path: string,
  silent: boolean,
  callback: (
    path: string,
    silent?: boolean,
  ) => Promise<FileContent | undefined>,
) {
  if (typeof window === "undefined") {
    return;
  }
  console.error({ error });
  const dialog = window.dialogApi;
  if (dialog) {
    const result = await dialog.showAlert({
      type: "error",
      title: "Failed to read file",
      message: error?.message || String(error),
      buttons: ["Cancel", "Retry"],
      defaultId: 1,
      cancelId: 0,
    });
    if (result.response === 1) {
      setTimeout(() => {
        callback(path, silent);
      }, 2500);
    }
  }
}

export async function onReadFolderError(
  error: any,
  path: string,
  silent: boolean,
  callback: (path: string, silent?: boolean) => Promise<void>,
) {
  if (typeof window === "undefined") {
    return;
  }
  console.error({ error });
  const dialog = window.dialogApi;
  if (dialog) {
    const result = await dialog.showAlert({
      type: "error",
      title: "Failed to read file",
      message: error?.message || String(error),
      buttons: ["Cancel", "Retry"],
      defaultId: 1,
      cancelId: 0,
    });
    if (result.response === 1) {
      setTimeout(() => {
        callback(path, silent);
      }, 2500);
    }
  }
}
