// terminal-dialog-portal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTerminalDialog } from "./useDialog";

export function TerminalDialogPortal() {
  const { content } = useTerminalDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !content) return null;

  const portalElement = document.getElementById("terminal-dialog-portal");
  if (!portalElement) return null;

  return createPortal(content, portalElement);
}
