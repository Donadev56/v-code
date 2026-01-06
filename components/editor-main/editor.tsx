import Monaco, { EditorProps, useMonaco } from "@monaco-editor/react";
import OPENCODE_THEME from "../themes/openscan.json";
import React from "react";

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
