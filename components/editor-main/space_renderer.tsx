import { OpenedFile } from "@/types/types";
import { ImageViewer } from "./image_viewer";
import { CodeEditor } from "./editor";
import { GetMonacoLanguage } from "@/lib/files";
import { isImage, isPdf, Uint8ArrayToString } from "@/lib/utils";
import PdfViewer from "./pdf_viewer";

export function EditorSpaceRenderer({
  file,
  updateFileContent,
}: {
  file: OpenedFile;
  updateFileContent: (newValue: string | undefined) => void;
}) {
  const isFileAnImage = isImage(file.path);
  const isFilePdf = isPdf(file.path);
  if (isFileAnImage) {
    return <ImageViewer file={file} />;
  }
  if (isFilePdf) {
    return <PdfViewer file={file} />;
  }

  return (
    <CodeEditor
      value={Uint8ArrayToString(file.content)}
      language={GetMonacoLanguage(file.name)}
      onChange={updateFileContent}
    />
  );
}
