import { useOpenEditor } from "@/hooks/useOpenEditor";
import { TerminalDialog } from "./terminal_dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React from "react";
import { useTerminalDialog } from "@/hooks/useDialog";

export const EnterPathDialog = () => {
  const editor = useOpenEditor();
  const dialog = useTerminalDialog();
  const [path, setPath] = React.useState(editor.currentPath);

  const submit = () => {
    if (path.trim().length === 0) {
      return;
    }
    editor.setCurrentPath(path);
    editor.openPath();
    dialog.hideDialog();
  };
  return (
    <TerminalDialog onSubmit={submit} isVisible showChildrenOnly>
      <div className="bg-card max-w-175 w-[90%] flex flex-col gap-3 p-4 border rounded ">
        <div className="">Open directory</div>
        <div className="w-full bg-muted/40  ">
          <input
            placeholder={editor.currentPath || "Enter path"}
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full bg-transparent rounded-(--rounded) px-4 py-1 focus:outline-none "
          />
        </div>

        <div onClick={submit}>
          <Button>Open</Button>
        </div>
      </div>
    </TerminalDialog>
  );
};
