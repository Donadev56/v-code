import { useOpenEditor } from "@/hooks/useOpenEditor";
import { cn } from "@/lib/utils";
import FileIcon from "./ui/file_icon";
import { X } from "lucide-react";
import { buf, OpenedFile } from "@/types/types";

export default function OpenedFilesView() {
  const { openedFiles, focusedFile, setFocusedFile, setOpenedFiles } =
    useOpenEditor();

  function removeFileFromBar(file: OpenedFile) {
    let rest: { [name: string]: OpenedFile } = {};
    let lastElementIndex = 0;
    setOpenedFiles((prev) => {
      lastElementIndex =
        Object.values(prev).findIndex((e) => e.path === file.path) - 1;
      const { [`${file.path}`]: _, ...r } = prev;
      rest = r;
      return rest;
    });

    setFocusedFile({ name: "", content: buf, path: "/" });
    if (Object.values(rest).length === 0) {
      return;
    }

    setFocusedFile({
      ...Object.values(rest).toReversed()[
        lastElementIndex < 0 ? 0 : lastElementIndex
      ],
    });
  }

  const Component = (
    <div className="flex border-b z-1 relative bg-background/20 backdrop-blur-2xl scrollbar-hide items-center overflow-x-scroll">
      {Object.values(openedFiles).map((e) => {
        const isCurrent = focusedFile?.path === e.path;

        return (
          <div className="relative group ">
            <div
              onClick={() => setFocusedFile(e)}
              className={cn(
                "px-4 py-1.5 w-full  text-nowrap pr-8 max-h-8.75 cursor-pointer hover:bg-muted/20 transition-all flex items-center gap-2  border",
                isCurrent && "border-t-primary",
              )}
            >
              <FileIcon size={16} filePath={e.path} />
              <div className="text-sm">{e.name} </div>
              {e.state === "UNSAVED" && (
                <div className="w-[7px] h-[7px] min-h-[7px] min-w-[7px] rounded-full bg-gray-500 "></div>
              )}
            </div>
            <X
              onClick={() => removeFileFromBar(e)}
              size={20}
              className=" text-transparent! group-hover:text-gray-400/70! hover:text-foreground absolute top-1/5 right-1 cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );

  if (Object.values(openedFiles).length) {
    return Component;
  }
  return <div></div>;
}
