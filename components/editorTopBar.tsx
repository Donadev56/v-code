"use client";

import { WindowButtons } from "./window_buttons";

export const EditorTopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="  max-h-[45px] px-7 py-2 min-h-[45px]  border-b  flex gap-2 w-full justify-between items-center ">
      <WindowButtons />
      {children}
    </div>
  );
};
