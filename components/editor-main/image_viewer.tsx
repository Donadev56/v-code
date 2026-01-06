import { useEditorDialog } from "@/hooks/useDialog";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import {
  getMimeType,
  isImage,
  Uint8ArrayToString,
  Utf8ToBase64,
} from "@/lib/utils";
import { OpenedFile } from "@/types/types";
import { BiError } from "react-icons/bi";

export const ImageViewer = ({ file }: { file: OpenedFile }) => {
  const isFileAnImage = isImage(file.path);
  if (!isFileAnImage) {
    return (
      <div className="w-full gap-2 h-full flex items-center justify-center ">
        <BiError /> Not Image
      </div>
    );
  }
  const mimeType = getMimeType(file.path);

  return (
    <div className="w-full flex items-center  p-8 h-full">
      <img
        src={`data:${mimeType};base64,${Uint8ArrayToString(file.content, "base64")}`}
      />
    </div>
  );
};
