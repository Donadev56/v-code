import Monaco, { EditorProps, useMonaco } from "@monaco-editor/react";
import OPENCODE_THEME from "../themes/openscan.json";
import React from "react";
import { Uint8ArrayToString } from "@/lib/utils";
import { GetMonacoLanguage } from "@/lib/files";
import { buf, FileRendererType } from "@/types/types";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import { toast } from "sonner";
import { toString } from "uint8arrays/to-string";

export const CodeEditor = ({ ...props }: EditorProps) => {
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
  const editor = useOpenEditor();
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
