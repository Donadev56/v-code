"use client";

import { WindowButtons } from "./window_buttons";

export const EditorBottom = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="  max-h-[30px] px-7 py-2 min-h-[30px]  border-t  flex gap-2 w-full justify-between items-center ">
      {children}
    </div>
  );
};
