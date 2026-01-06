import { FileRendererType, OpenedFile, SupportedFileType } from "@/types/types";
import { ImageViewer } from "./image_viewer";
import { CodeEditor, CodeEditorRenderer } from "./editor";
import { GetMonacoLanguage } from "@/lib/files";
import {
  getFileRendererTypeByPath,
  isImage,
  isPdf,
  Uint8ArrayToString,
} from "@/lib/utils";
import PdfViewer from "./pdf_viewer";
import { JSX } from "react";

export function EditorSpaceRenderer({
  file,
  updateFileContent,
}: {
  file: OpenedFile;
  updateFileContent: (newValue: string | undefined) => void;
}) {
  const components: { [x: string]: (props: FileRendererType) => JSX.Element } =
    {
      image: ImageViewer,
      text: PdfViewer,
      pdf: CodeEditorRenderer,
    };

  const fileType = getFileRendererTypeByPath(file.path);
  const Component = components[fileType];

  return <Component file={file} updateFileContent={updateFileContent} />;
}
