import { useOpenEditor } from "@/hooks/useOpenEditor";
import { TerminalComponent } from "./terminal";
import { cn } from "@/lib/utils";

export const TerminalsView = ({
  currentTerminalId,
  setCurrentTerminalId,
}: {
  currentTerminalId: number;
  setCurrentTerminalId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { activeTerminalIds } = useOpenEditor();
  return (
    <div className=" max-w-[90%] min-w-[90%] h-full w-full">
      {[...activeTerminalIds].map((id) => {
        const isCurrent = id === currentTerminalId;

        return (
          <div className={cn("hidden", isCurrent && "block")}>
            {" "}
            <TerminalComponent key={id} processId={id} />
          </div>
        );
      })}
    </div>
  );
};
