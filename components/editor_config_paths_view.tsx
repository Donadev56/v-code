import { useOpenEditor } from "@/hooks/useOpenEditor";
import { EditorDialog } from "./editor_dialog";
import { getKeyFromConfig } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useEditorDialog } from "@/hooks/useDialog";
import { EnterConfigDialog } from "./editor_inputs";
import React from "react";

export const EditorConfigPathsListView = () => {
  const editor = useOpenEditor();
  const dialog = useEditorDialog();
  const config = React.useMemo(() => {
    if (!editor.config) {
      return null;
    }
    const key = getKeyFromConfig(editor.config!);
    return editor.localConfig[key];
  }, [editor]);
  return (
    <EditorDialog isVisible showChildrenOnly>
      <div className="bg-card max-w-175 w-[90%] flex flex-col gap-3 p-4 border rounded ">
        <div className="w-full items-center flex  justify-between ">
          <div className="text-[12px] ">Config List</div>
          <div
            onClick={() => {
              dialog.showDialog(<EnterConfigDialog />);
            }}
            className=" "
          >
            <PlusIcon size={17} />
          </div>
        </div>

        <div className=" flex flex-col gap-2 w-full">
          {config &&
            config.paths.map((e, index) => {
              return (
                <div
                  className="w-full text-sm px-2.5 py-1 flex  transition-all hover:bg-muted/70 cursor-pointer rounded bg-muted/40 "
                  onClick={() => {
                    editor.openPath(e);
                    dialog.showDialog(<EnterConfigDialog />);
                  }}
                  key={index}
                >
                  <div>{index} | </div> {e}
                </div>
              );
            })}
        </div>
      </div>
    </EditorDialog>
  );
};
