"use client";
import { TerminalTopBar } from "./terminalTopBar";

import { useOpenEditor } from "@/hooks/useOpenEditor";
import { IoClose, IoTerminalOutline } from "react-icons/io5";
import { useTerminalDialog } from "@/hooks/useDialog";
import { EnterPathDialog } from "@/components/terminal_inputs";
import { FaMinus } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";

export const TerminalTopEditorView = () => {
  const {
    isTerminalVisible,

    setIsTerminalVisible,

    currentPath,
  } = useOpenEditor();

  const dialog = useTerminalDialog();

  const topOptions = [
    {
      onClick: undefined,
      children: (
        <div
          className="bg-card justify-end w-full my-2 rounded-[5px] flex gap-2 items-center "
          onClick={() => dialog.showDialog(<EnterPathDialog />)}
        >
          <input
            className="w-full text-sm text-muted-foreground px-2 py-0.5 "
            value={currentPath}
            placeholder={currentPath || "Enter path"}
          />
        </div>
      ),
    },
    {
      onClick: () => setIsTerminalVisible(!isTerminalVisible),
      children: <IoTerminalOutline />,
    },
  ];

  const leftOptions = [
    {
      color: "var(--color-red-400)",
      icon: <IoClose size={11} />,
      onclick: () => {
        if (typeof window !== "undefined") {
          (window as any)?.windowAPI.close();
        }
      },
    },
    {
      color: "var(--color-orange-400)",
      icon: <FaMinus size={11} />,
      onclick: () => {
        if (typeof window !== "undefined") {
          (window as any)?.windowAPI.minimize();
        }
      },
    },
    {
      color: "var(--color-green-400)",
      icon: <RiExpandUpDownFill size={11} className="rotate-120" />,

      onclick: () => {
        if (typeof window !== "undefined") {
          (window as any)?.windowAPI.maximize();
        }
      },
    },
  ];

  return (
    <TerminalTopBar>
      <div>
        <div className="items-center group flex gap-2 justify-start">
          {leftOptions.map((e) => {
            return (
              <div
                onClick={e.onclick}
                style={{ backgroundColor: e.color }}
                className="size-[16px] min-w-[16px] transition-all group-hover:text-background! minh-[16px] rounded-full flex text-transparent! items-center justify-center "
              >
                {e.icon}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
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
    </TerminalTopBar>
  );
};
