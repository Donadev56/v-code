import { useEditorDialog } from "@/hooks/useDialog";
import { EditorBottom } from "./editorBottom";
import { VscVmConnect } from "react-icons/vsc";
import { EditorConfigListView } from "./editor_config_list_view";

export const EditorBottomView = () => {
  const dialog = useEditorDialog();

  const leftOptions = [
    {
      icon: <VscVmConnect />,
      onClick: () => dialog.showDialog(<EditorConfigListView />),
    },
  ];
  return (
    <EditorBottom>
      <div className="w-full flex items-center overflow-x-scroll  max-w-[100%">
        <div className="flex  gap-2 w-full">
          <div>
            {leftOptions.map((e) => {
              return (
                <div
                  onClick={e.onClick}
                  className="min-h-[20px] max-h-[20px] size-[20px] min-w-[20px] max-w-[20px] "
                >
                  {e.icon}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EditorBottom>
  );
};
