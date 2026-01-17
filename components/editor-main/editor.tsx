import Monaco, { EditorProps, useMonaco } from "@monaco-editor/react";
import OPENCODE_THEME from "../themes/openscan.json";
import React from "react";
import { Uint8ArrayToString } from "@/lib/utils";
import { GetMonacoLanguage } from "@/lib/files";
import { buf, FileRendererType } from "@/types/types";
import { useOpenEditor } from "@/hooks/useOpenEditor";

export const CodeEditor = ({ ...props }: EditorProps) => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (!monaco) {
      return;
    }
    monaco.editor.defineTheme("OpenCode", OPENCODE_THEME as any);
    monaco.editor.setTheme("OpenCode");
    monaco.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.typescript.JsxEmit.React,
      allowNonTsExtensions: true,
    });
  }, [monaco]);

  return (
    <div className=" p-4 w-full h-full  ">
      <Monaco {...props} theme="OpenCode" />
    </div>
  );
};

export const CodeEditorRenderer = ({
  file,
  updateFileContent,
}: FileRendererType) => {
  console.log({ file });
  const editor = useOpenEditor();
  console.log("SSH SERVER PATH", file.path);
  const path = `ssh://${editor.config?.user}@${editor.config?.host}${file.path}`;
  console.log({ remote: path });

  return (
    <CodeEditor
      value={
        file.content === buf || file.content.length === 0
          ? ""
          : Uint8ArrayToString(file.content)
      }
      path={path} // 🔥 THIS IS ESSENTIAL
      language={GetMonacoLanguage(file.name)}
      onChange={(newValue) => updateFileContent({ file, newValue })}
    />
  );
};
