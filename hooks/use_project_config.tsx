"use client";
import OPENCODE_THEME from "@/components/themes/openscan.json";
import ts from "typescript";

import { ProjectConfigContextType, TSConfigApi } from "@/types/types";
import { useMonaco } from "@monaco-editor/react";
import React, { useRef } from "react";
import { createContext, useContext, useState, ReactNode } from "react";
import { useOpenEditor } from "./useOpenEditor";
import { toast } from "sonner";
import { toString } from "uint8arrays/to-string";

const ProjectConfigContext = createContext<
  ProjectConfigContextType | undefined
>(undefined);

export function ProjectConfigProvider({ children }: { children: ReactNode }) {
  const monaco = useMonaco();
  const editor = useOpenEditor();
  const [root, setRoot] = React.useState("");

  React.useEffect(() => {
    if (!monaco) {
      return;
    }
    monaco.editor.defineTheme("OpenCode", OPENCODE_THEME as any);
    monaco.editor.setTheme("OpenCode");
  }, [monaco]);

  React.useEffect(() => {
    if (!editor.currentPath || !editor.isSftpConnected) {
      return;
    }
    initMonacoTs();
  }, [editor.currentPath]);
  function initMonacoTs() {
    toast.promise(_initMonacoTs, {
      loading: "Initializing...",
    });
  }
  async function _initMonacoTs() {
    try {
      if (!monaco) {
        return;
      }
      const result = await readTsConfigFile();
      if (!result) {
        console.log("Result not found");
        return;
      }
      if (!result.json) {
        throw new Error("TS config not found");
      }
      const compilerConfig = tsConfigToMonacoOptions(
        result.json,
        result.projectRoot,
      );

      monaco.typescript.typescriptDefaults.setCompilerOptions(
        compilerConfig as any,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function tsConfigToMonacoOptions(tsconfig: any, projectRoot: string) {
    console.log({ tsconfig, projectRoot });
    if (typeof window === "undefined") {
      throw new Error("Window not defined");
    }
    let parsed: ts.ParsedCommandLine | null = null;

    try {
      parsed = await (window.TSConfigApi as TSConfigApi).parseSourceFileContent(
        { tsconfig, projectRoot },
      );
    } catch (error) {
      console.log(error);
    }
    console.log({ parsed });

    return parsed?.options || tsconfig.compilerOptions;
  }

  async function readTsConfigFile() {
    try {
      const root = await detectNodeProjectRoot();
      if (!root) {
        throw new Error("Project root not found");
      }
      setRoot(root);
      const tsconfigContent = await editor.readFile(`${root}/tsconfig.json`);
      const json = tsconfigContent
        ? ts.parseConfigFileTextToJson(
            `${root}/tsconfig.json`,
            toString(tsconfigContent, "utf-8"),
          ).config || {}
        : {};
      console.log({ json });
      return { json, projectRoot: root };
    } catch (error) {
      console.error(error);
    }
  }
  async function detectNodeProjectRoot() {
    try {
      let currentPath = editor.currentPath;
      while (currentPath && currentPath !== "/") {
        if (await editor.exists(`${currentPath}/package.json`)) {
          return currentPath;
        }

        const segments = currentPath.split("/").filter(Boolean);
        segments.pop();
        currentPath = "/" + segments.join("/");
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const state: ProjectConfigContextType = {
    root,
    setRoot,
  };

  return (
    <ProjectConfigContext.Provider value={state}>
      {children}
    </ProjectConfigContext.Provider>
  );
}

export function useProjectConfig() {
  const context = useContext(ProjectConfigContext);
  if (context === undefined) {
    throw new Error(
      "useProjectConfig must be used within an ProjectConfigProvider",
    );
  }
  return context;
}
