import { useOpenEditor } from "@/hooks/useOpenEditor";
import { EditorDialog } from "./editor_dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React from "react";
import { useEditorDialog } from "@/hooks/useDialog";
import { toast } from "sonner";
import { DialogContainer } from "./dialog-container";
import { FormField } from "./ui/form-field";
import { CustomButton } from "./ui/custom-button";
import { SSH_CONFIG } from "@/types/types";
import { getKeyFromConfig } from "@/lib/utils";

export const EnterPathDialog = () => {
  const editor = useOpenEditor();
  const dialog = useEditorDialog();
  const [path, setPath] = React.useState(editor.currentPath);
  const config = React.useMemo(() => {
    if (!editor.config) {
      return null;
    }
    const key = getKeyFromConfig(editor.config!);
    return editor.localConfig[key];
  }, [editor]);

  const handleSubmit = () => {
    if (!path.trim()) return;

    editor.openPath(path);
    dialog.hideDialog();
  };

  return (
    <EditorDialog onSubmit={handleSubmit} isVisible showChildrenOnly>
      <DialogContainer title="Open Directory">
        <div className=" flex flex-col gap-2 w-full">
          {config?.paths?.sort().map((e, index) => {
            return (
              <div
                className="w-full text-sm px-2.5 py-1 flex  transition-all hover:bg-muted/70 cursor-pointer rounded bg-muted/40 "
                onClick={() => {
                  editor.openPath(e);
                  if (!editor.isSftpConnected) {
                    dialog.showDialog(<EnterConfigDialog />);
                  } else {
                    dialog.hideDialog();
                  }
                }}
                key={index}
              >
                {e}
              </div>
            );
          })}
        </div>
        <FormField
          label="Directory Path"
          id="path"
          name="path"
          placeholder={editor.currentPath || "Enter directory path..."}
          value={path}
          onChange={setPath}
        />
        <div className="pt-2">
          <CustomButton
            variant="primary"
            onClick={handleSubmit}
            className="w-full"
          >
            Open Directory
          </CustomButton>
        </div>
      </DialogContainer>
    </EditorDialog>
  );
};

export const EnterConfigDialog = () => {
  const editor = useOpenEditor();
  const dialog = useEditorDialog();

  const config = editor.config || {
    host: "",
    port: 22,
    user: "",
    password: "",
  };

  const handleInputChange = (field: keyof SSH_CONFIG) => (value: string) => {
    editor.setConfig((prev) => ({
      ...(prev || {
        host: "",
        port: 22,
        user: "",
        password: "",
      }),
      [field]: field === "port" ? parseInt(value) || 22 : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await editor.connectServer();
      dialog.hideDialog();
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to connect");
      console.error("Connection error:", error);
    }
  };

  const handleConnect = () => {
    toast.promise(handleSubmit, {
      loading: "Connecting to server...",
    });
  };

  return (
    <EditorDialog onSubmit={handleConnect} isVisible showChildrenOnly>
      <DialogContainer title="Connect to Server" className="max-w-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <FormField
              label="Host"
              id="host"
              name="host"
              placeholder="0.0.0.0"
              value={config.host}
              onChange={handleInputChange("host")}
              required
            />

            <FormField
              label="Port"
              id="port"
              name="port"
              type="number"
              placeholder="22"
              value={config.port.toString()}
              onChange={handleInputChange("port")}
              required
            />
          </div>

          <FormField
            label="Username"
            id="user"
            name="user"
            placeholder="root"
            value={config.user}
            onChange={handleInputChange("user")}
            required
          />

          <FormField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={config.password || ""}
            onChange={handleInputChange("password")}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <CustomButton
            variant="secondary"
            onClick={dialog.hideDialog}
            className="flex-1"
          >
            Cancel
          </CustomButton>

          <CustomButton
            variant="primary"
            onClick={handleConnect}
            className="flex-1"
          >
            Connect
          </CustomButton>
        </div>
      </DialogContainer>
    </EditorDialog>
  );
};
