import { FileRendererType, OpenedFile, SupportedFileType } from "@/types/types";
import { ImageViewer } from "./image_viewer";
import { CodeEditor, CodeEditorRenderer } from "./editor";
import { getFileRendererTypeByPath } from "@/lib/utils";
import PdfViewer from "./pdf_viewer";
import { JSX } from "react";

export function EditorSpaceRenderer({
  file,
  updateFileContent,
}: FileRendererType) {
  const components: { [x: string]: (props: FileRendererType) => JSX.Element } =
    {
      image: ImageViewer,
      text: CodeEditorRenderer,
      pdf: PdfViewer,
    };
  const defaultRenderer = CodeEditorRenderer;
  const fileType = getFileRendererTypeByPath(file.path);
  const Component = components[fileType] || defaultRenderer;

  return <Component file={file} updateFileContent={updateFileContent} />;
}

