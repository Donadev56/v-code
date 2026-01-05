import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TranslateY } from "./translate";
import { useTerminalDialog } from "@/hooks/useDialog";
import { useOpenEditor } from "@/hooks/useOpenEditor";

export interface TerminalButton extends React.ComponentProps<typeof Button> {
  text?: string;
  icon?: React.ReactNode;
}

export interface TerminalInput extends React.ComponentProps<typeof Input> {
  icon?: React.ReactNode;
}

export interface TerminalDialogProps extends React.ComponentProps<"div"> {
  isVisible: boolean;
  buttons?: React.ReactNode[];
  title?: string;
  children?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  footerClassName?: string;
  headerClassName?: string;
  showChildrenOnly?: boolean;
  onSubmit?: () => void;
}

export const TerminalDialog: React.FC<TerminalDialogProps> = ({
  isVisible,
  buttons,
  className,
  title,
  children,
  showHeader = true,
  showFooter = true,
  footerClassName,
  headerClassName,
  showChildrenOnly,
  onSubmit,
  ...props
}) => {
  const dialog = useTerminalDialog();
  const renderButtons = () => {
    if (!buttons?.length) return null;

    return buttons.map((button, index) => (
      <div key={index} className="ml-2 first:ml-0">
        {button}
      </div>
    ));
  };

  return (
    <TranslateY className="w-full" condition={isVisible}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div
          className={cn(
            "fixed flex top-10 left-0 right-0 w-full justify-center items-center p-4",
          )}
        >
          <div
            onClick={() => dialog.hideDialog()}
            className="bg-black/40 top-0 left-0 right-0 bottom-0 fixed z-99 w-full h-full "
          />
          <div className="z-100">
            {showChildrenOnly ? (
              children
            ) : (
              <div
                className={cn(
                  "rounded-(--rounded) border bg-card text-card-foreground shadow-lg",
                  "transition-all duration-200 ease-in-out",
                  className,
                )}
                {...props}
              >
                {showHeader && (
                  <div
                    className={cn(
                      "flex flex-col space-y-1.5 px-6 py-4 pb-2",
                      headerClassName,
                    )}
                  >
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      {title}
                    </h3>
                  </div>
                )}

                {children}

                {showFooter && buttons && buttons?.length > 0 && (
                  <div
                    className={cn(
                      "flex items-center justify-end space-x-2 p-6 pt-4",
                      footerClassName,
                    )}
                  >
                    {renderButtons()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </TranslateY>
  );
};

export const TerminalButton = ({
  text,
  icon,
  className,
  ...props
}: TerminalButton) => {
  return (
    <Button {...props} className={cn("w-full", className)}>
      {text || "confirm"}
      {icon}
    </Button>
  );
};

export const TerminalInput = ({ icon, className, ...props }: TerminalInput) => {
  return (
    <div className="w-full flex gap-2 items-center">
      {icon}
      <Input className={cn("w-full", className)} {...props} />
    </div>
  );
};
