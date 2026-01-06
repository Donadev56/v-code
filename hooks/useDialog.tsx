// terminal-dialog-provider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface EditorDialogContextType {
  showDialog: (content: React.ReactNode) => void;
  hideDialog: () => void;
  isVisible: boolean;
  content: React.ReactNode;
}

const EditorDialogContext = createContext<EditorDialogContextType | undefined>(
  undefined,
);

export function useEditorDialog() {
  const context = useContext(EditorDialogContext);
  if (!context) {
    throw new Error("useEditorDialog must be used within EditorDialogProvider");
  }
  return context;
}

interface EditorDialogProviderProps {
  children: React.ReactNode;
}

export function EditorDialogProvider({ children }: EditorDialogProviderProps) {
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
    <EditorDialogContext.Provider
      value={{ showDialog, hideDialog, isVisible, content }}
    >
      {children}
      <div id="terminal-dialog-portal" />
    </EditorDialogContext.Provider>
  );
}
