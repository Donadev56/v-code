"use client";

import * as vscode from "vscode";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import { UserRound } from "lucide-react";
import { FileContent, FileItem } from "@/types/types";

type SshFsProvider = {
  readFile(path: string): Promise<FileContent | undefined>;
  writeFile({
    file,
    newValue,
  }: {
    file: {
      path: string;
      content: FileContent;
    };
    newValue: string | undefined;
  }): Promise<
    | {
        success: boolean;
        error: any;
      }
    | undefined
  >;
  getPathFiles(path: string): Promise<Record<string, FileItem> | undefined>;
};
export function registerSshFsProvider(api: SshFsProvider) {
  try {
    const scheme = "ssh";
    const fileChangeEmitter = new vscode.EventEmitter<
      vscode.FileChangeEvent[]
    >();
    vscode.workspace.registerFileSystemProvider(
      scheme,
      {
        async readFile(uri) {
          console.log({ uri });
          const data = await api.readFile(uri.path);
          return data ?? new Uint8Array();
        },

        async writeFile(uri, content) {
          console.log({ uri, content });
          await api.writeFile({
            file: { path: uri.path, content },
            newValue: new TextDecoder().decode(content),
          });
          fileChangeEmitter.fire([
            { type: vscode.FileChangeType.Changed, uri },
          ]);
        },

        async readDirectory(uri) {
          console.log({ uri });
          const items = await api.getPathFiles(uri.path);
          if (!items) return [];

          return Object.values(items)
            .filter((i) => i.data.path)
            .map((i) => [
              i.name,
              i.isFolder ? vscode.FileType.Directory : vscode.FileType.File,
            ]);
        },

        stat() {
          return {
            type: vscode.FileType.File,
            ctime: 0,
            mtime: Date.now(),
            size: 0,
          };
        },

        watch() {
          return { dispose() {} };
        },

        createDirectory: async () => {},
        delete: async () => {},
        rename: async () => {},

        onDidChangeFile: fileChangeEmitter.event,
      },
      { isCaseSensitive: true },
    );
  } catch (error) {
    console.log(error);
  }
}
