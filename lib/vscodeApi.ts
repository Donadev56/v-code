"use client";

import {
  MonacoVscodeApiWrapper,
  type MonacoVscodeApiConfig,
} from "monaco-languageclient/vscodeApiWrapper";
import { configureDefaultWorkerFactory } from "monaco-languageclient/workerFactory";

let started = false;

export async function startVscodeApi() {
  if (started) return;
  started = true;

  const config: MonacoVscodeApiConfig = {
    $type: "extended",
    viewsConfig: {
      $type: "EditorService",
    },
    userConfiguration: {
      json: JSON.stringify({
        "editor.wordBasedSuggestions": "off",
        "typescript.tsserver.web.typeAcquisition.enabled": true,
      }),
    },
    monacoWorkerFactory: configureDefaultWorkerFactory,
  };

  const wrapper = new MonacoVscodeApiWrapper(config);
  await wrapper.start();
}
