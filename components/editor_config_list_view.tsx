import { useOpenEditor } from "@/hooks/useOpenEditor";
import { EditorDialog } from "./editor_dialog";
import { getKeyFromConfig } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useEditorDialog } from "@/hooks/useDialog";
import { EnterConfigDialog } from "./editor_inputs";

export const EditorConfigListView = () => {
  const editor = useOpenEditor();
  const dialog = useEditorDialog();
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
          {Object.values(editor.localConfig).map((e) => {
            const key = getKeyFromConfig(e.config);
            return (
              <div
                className="w-full text-sm px-2.5 py-1 transition-all hover:bg-muted/70 cursor-pointer rounded bg-muted/40 "
                onClick={() => {
                  editor.setConfig((config) => ({
                    ...config,
                    ...e.config,
                  }));
                  dialog.showDialog(<EnterConfigDialog />);
                }}
                key={key}
              >
                {key}
              </div>
            );
          })}
        </div>
      </div>
    </EditorDialog>
  );
};
