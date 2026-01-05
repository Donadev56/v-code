// terminal-dialog-provider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface TerminalDialogContextType {
  showDialog: (content: React.ReactNode) => void;
  hideDialog: () => void;
  isVisible: boolean;
  content: React.ReactNode;
}

const TerminalDialogContext = createContext<
  TerminalDialogContextType | undefined
>(undefined);

export function useTerminalDialog() {
  const context = useContext(TerminalDialogContext);
  if (!context) {
    throw new Error(
      "useTerminalDialog must be used within TerminalDialogProvider",
    );
  }
  return context;
}

interface TerminalDialogProviderProps {
  children: React.ReactNode;
}

export function TerminalDialogProvider({
  children,
}: TerminalDialogProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const showDialog = (newContent: React.ReactNode) => {
    setContent(newContent);
    setIsVisible(true);
  };

  const hideDialog = () => {
    setIsVisible(false);
    setTimeout(() => setContent(null), 200);
  };

  return (
    <TerminalDialogContext.Provider
      value={{ showDialog, hideDialog, isVisible, content }}
    >
      {children}
      <div id="terminal-dialog-portal" />
    </TerminalDialogContext.Provider>
  );
}
