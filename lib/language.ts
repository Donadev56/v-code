"use client";

import * as vscode from "vscode";
import {
  LanguageClientWrapper,
  type LanguageClientConfig,
} from "monaco-languageclient/lcwrapper";
import { SSH_CONFIG } from "@/types/types";

let client: LanguageClientWrapper | null = null;

export async function startTsLanguageClient(
  workspaceRoot: string,
  sshConfig: SSH_CONFIG,
) {
  if (client) return client;

  const config: LanguageClientConfig = {
    languageId: "typescript",
    connection: {
      options: {
        $type: "WebSocketUrl",
        url: "ws://localhost:3001/tsserver",
      },
    },
    clientOptions: {
      documentSelector: [
        "typescript",
        "typescriptreact",
        "javascript",
        "javascriptreact",
      ],
      workspaceFolder: {
        index: 0,
        name: "ssh-workspace",
        uri: vscode.Uri.parse(
          `ssh://${sshConfig.user}@${sshConfig.host}${workspaceRoot}`,
        ),
      },
    },
  };

  client = new LanguageClientWrapper(config);
  await client.start();
  return client;
}
