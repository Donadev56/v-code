import Monaco, { EditorProps, useMonaco } from "@monaco-editor/react";
import OPENCODE_THEME from "../themes/openscan.json";
import React from "react";
import { Uint8ArrayToString } from "@/lib/utils";
import { GetMonacoLanguage } from "@/lib/files";
import { FileRendererType } from "@/types/types";

export const CodeEditor = ({ ...props }: EditorProps) => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (!monaco) {
      return;
    }
    monaco.editor.defineTheme("OpenCode", OPENCODE_THEME as any);
    monaco.editor.setTheme("OpenCode");
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
  return (
    <CodeEditor
      value={Uint8ArrayToString(file.content)}
      language={GetMonacoLanguage(file.name)}
      onChange={updateFileContent}
    />
  );
};
