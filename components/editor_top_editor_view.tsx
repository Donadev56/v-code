"use client";
import { IoMdCheckmark } from "react-icons/io";

import { useOpenEditor } from "@/hooks/useOpenEditor";
import { IoClose, IoTerminalOutline } from "react-icons/io5";
import { EnterConfigDialog, EnterPathDialog } from "@/components/editor_inputs";
import { FaMinus } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";
import { WindowButtons } from "./window_buttons";
import { PlusIcon } from "lucide-react";
import { VscTerminalBash } from "react-icons/vsc";
import { BsTerminalFill } from "react-icons/bs";
import { EditorTopBar } from "./editorTopBar";
import { useEditorDialog } from "@/hooks/useDialog";

export const EditorTopView = () => {
  const { isTerminalVisible, setIsTerminalVisible, currentPath } =
    useOpenEditor();

  const dialog = useEditorDialog();
  const editor = useOpenEditor();

  const topOptions = [
    {
      onClick: undefined,
      children: (
        <div
          className="bg-card  justify-end w-full my-2 rounded-[5px] flex gap-2 items-center "
          onClick={() => dialog.showDialog(<EnterPathDialog />)}
        >
          <input
            className="w-full min-w-[100px] text-sm text-muted-foreground px-2 py-0.5 "
            value={currentPath}
            placeholder={currentPath || "Enter path"}
          />
        </div>
      ),
    },
    {
      onClick: () => setIsTerminalVisible(!isTerminalVisible),
      children: !editor.isTerminalVisible ? (
        <IoTerminalOutline />
      ) : (
        <BsTerminalFill />
      ),
    },
  ];

  function showEnterConfigDialog() {
    dialog.showDialog(<EnterConfigDialog />);
  }

  return (
    <EditorTopBar>
      <div className="w-full flex items-center overflow-x-scroll  max-w-[100%">
        <div className="flex  gap-2 w-full">
          <div className="px-2 text-[12px] text-muted-foreground py-0.5 bg-card rounded ">
            {editor.config?.user || "user"}
            {`@`}
            {editor.config?.host || "0.0.0.0"}
          </div>
          {editor.isSftpConnected && (
            <div
              onClick={showEnterConfigDialog}
              className="text-[12px] gap-2 flex items-center px-4 py-0.5 rounded  transition-all cursor-pointer  bg-green-400/20 text-green-400"
            >
              Connected
              <IoMdCheckmark />
            </div>
          )}
          {editor.isSftpConnected ? (
            <div
              onClick={() => showEnterConfigDialog()}
              className="min-h-[20px]  transition-all  w-[20px] max-w-[20px] max-h-[20px] bg-primary/20 text-primary rounded flex justify-center items-center"
            >
              <PlusIcon size={15} />
            </div>
          ) : (
            <div
              onClick={showEnterConfigDialog}
              className="text-[12px]  gap-2 flex items-center px-4 py-0.5 rounded hover:bg-primary transition-all cursor-pointer hover:text-background bg-primary/20 text-primary"
            >
              Connect
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <div></div>
          {topOptions.map((e) => {
            return (
              <div
                onClick={() => {
                  if (e.onClick) {
                    e.onClick();
                  }
                }}
              >
                {e.children}
              </div>
            );
          })}
        </div>
      </div>
    </EditorTopBar>
  );
};
