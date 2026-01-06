import { IoClose, IoTerminalOutline } from "react-icons/io5";
import { EnterPathDialog } from "@/components/editor_inputs";
import { FaMinus } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";

export const WindowButtons = () => {
  const leftOptions = [
    {
      color: "var(--color-red-400)",
      icon: <IoClose size={12} />,
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
    <div className="items-center group flex gap-2 justify-start">
      {leftOptions.map((e) => {
        return (
          <div
            onClick={e.onclick}
            style={{ backgroundColor: e.color }}
            className="size-[13px] min-w-[13px] transition-all group-hover:text-background! min-h-[13px] rounded-full flex text-transparent! items-center justify-center "
          >
            {e.icon}
          </div>
        );
      })}
    </div>
  );
};
