import Monaco, { EditorProps, useMonaco } from "@monaco-editor/react";
import React from "react";
import { GetMonacoLanguage } from "@/lib/files";
import { buf, FileRendererType } from "@/types/types";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import { pathToUri } from "@/lib/utils";

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
  const monaco = useMonaco();
  const uri = React.useMemo(() => {
    return pathToUri(editor.config || ({} as any), file.path);
  }, [editor.config, file.path]);

  React.useEffect(() => {
    debugModel();
  }, [editor.config, file.path]);

  function debugModel() {
    if (!monaco) {
      return;
    }
    console.log(
      "Model exists?",
      uri,
      !!monaco.editor.getModel(monaco.Uri.parse(uri)),
    );
  }

  return (
    <CodeEditor
      path={pathToUri(editor.config || ({} as any), file.path)}
      language={GetMonacoLanguage(file.name)}
      onChange={(newValue) => updateFileContent({ file, newValue })}
    />
  );
};
