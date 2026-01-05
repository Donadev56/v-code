"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

import { SSHApi, SshData, TerminalState } from "@/types/types";
import { isPaste, KeyCodes, TerminalOptions } from "@/lib/utils";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import { toast } from "sonner";

const PROMPT = "$ ";

export const TerminalComponent = ({ processId }: { processId: number }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const sshApiRef = useRef<SSHApi | null>(null);
  const inputBufferRef = useRef("");
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const [waitingData, setWaitingData] = React.useState<SshData[]>([]);
  const {
    terminalState,
    setTerminalState,
    connect,
    addTerminal,
    onConnected,
    deleteTerminal,
  } = useOpenEditor();
  const listenersAttachedRef = useRef(false);

  const initializeTerminal = () => {
    console.log("Initializing :", processId);
    if (!containerRef.current || termRef.current) return;
    const terminal = new Terminal(TerminalOptions);
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);

    setTimeout(() => {
      fitAddon.fit();
      terminal.focus();
    }, 10);

    termRef.current = terminal;
    fitAddonRef.current = fitAddon;
    addTerminal(terminal, processId);

    terminal.writeln("Terminal initialized.");
    terminal.writeln("Connecting to SSH...");
  };

  React.useEffect(() => {
    if (termRef.current) {
      for (const data of waitingData) {
        termRef.current.write(data[processId.toString()].data);
        setTermState(true, "ready");
      }
      setWaitingData([]);
    }
  }, [termRef, waitingData]);

  React.useEffect(() => {
    if (sshApiRef.current?.isConnected()) {
      onConnected(processId);
    }
  }, [sshApiRef]);

  function setTermState(connected: boolean, state: TerminalState) {
    setTerminalState((prev) => ({
      ...prev,
      [`${processId}`]: {
        state,
        isConnected: connected,
      },
    }));
  }

  function onError(error: SshData) {
    console.log(error);
    const terminal = termRef.current;
    if (!terminal) throw new Error("Terminal not init");
    terminal.writeln(`\r\n❌ Error: ${error[processId].data}`);
    setTermState(false, "errored");

    setTimeout(() => {
      if (terminalState[processId].state === "errored") {
        if (!terminal) return;
        terminal.writeln("\r\nAttempting to reconnect...");
        setTermState(false, "waiting");

        connect();
      }
    }, 3000);
  }

  function onData(data: SshData) {
    try {
      if (!data[processId.toString()]?.data) {
        return;
      }

      const terminal = termRef.current;
      if (!terminal) {
        console.error("Terminal not found");
        initializeTerminal();
        setWaitingData((prev) => [...prev, data]);
        return;
      }

      terminal.write(data[processId.toString()].data);
      setTermState(true, "ready");
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message ?? String(error));
    }
  }

  const setupSSHConnection = () => {
    const terminal = termRef.current;
    if (!terminal || typeof window === "undefined") return;

    const sshApi = (window as any)?.sshApi as SSHApi | undefined;
    if (!sshApi) {
      terminal.writeln("Error: SSH API not available");
      setTermState(false, "errored");
      return;
    }

    sshApiRef.current = sshApi;
    sshApi.onConnected((data) => onConnected(data.processId));
    sshApi.onError(onError);
    sshApi.onData(onData);

    return () => deleteTerminal(processId);
  };

  const processCommand = (command: string) => {
    const terminal = termRef.current;
    const ssh = sshApiRef.current;

    if (!terminal || !ssh) return;

    if (command.trim()) {
      commandHistoryRef.current = [
        command,
        ...commandHistoryRef.current.slice(0, 49),
      ];
      historyIndexRef.current = -1;
    }

    setTermState(true, "executing");

    try {
      ssh.write({
        cmd: command,
        processId,
      });
    } catch (error) {
      terminal.writeln(`\r\nCommand error: ${error}`);
      setTermState(true, "ready");
      terminal.write(PROMPT);
    }
  };

  const handleData = (data: string) => {
    const terminal = termRef.current;
    if (!terminal || terminalState[processId.toString()].state !== "ready")
      return;

    if (isPaste(data)) {
      const pasted = data.slice(6, -6);
      inputBufferRef.current += pasted;
      terminal.write(pasted);
      return;
    }

    switch (data) {
      case KeyCodes.ENTER: {
        terminal.write("\r\n");

        const command = inputBufferRef.current;
        inputBufferRef.current = "";

        if (command.trim()) {
          processCommand(command);
        } else {
          terminal.write(PROMPT);
        }
        return;
      }

      case KeyCodes.BACKSPACE: {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          terminal.write("\b \b");
        }
        return;
      }

      case KeyCodes.DELETE: {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          terminal.write("\b \b");
        }
        return;
      }

      case KeyCodes.ARROW_UP: {
        if (commandHistoryRef.current.length === 0) return;

        if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
          historyIndexRef.current++;
          const command = commandHistoryRef.current[historyIndexRef.current];

          terminal.write(
            "\r" + " ".repeat(inputBufferRef.current.length + PROMPT.length),
          );
          terminal.write("\r" + PROMPT);

          terminal.write(command);
          inputBufferRef.current = command;
        }
        return;
      }

      case KeyCodes.ARROW_DOWN: {
        if (historyIndexRef.current <= 0) {
          historyIndexRef.current = -1;
          terminal.write(
            "\r" + " ".repeat(inputBufferRef.current.length + PROMPT.length),
          );
          terminal.write("\r" + PROMPT);
          inputBufferRef.current = "";
          return;
        }

        historyIndexRef.current--;
        const command = commandHistoryRef.current[historyIndexRef.current];

        terminal.write(
          "\r" + " ".repeat(inputBufferRef.current.length + PROMPT.length),
        );
        terminal.write("\r" + PROMPT + command);
        inputBufferRef.current = command;
        return;
      }

      case KeyCodes.CTRL_C:
        console.log("control C");
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = "";
          terminal.write("^C\r\n" + PROMPT);
          sshApiRef.current?.write({ cmd: KeyCodes.CTRL_C, processId });
        }
        return;

      case KeyCodes.CTRL_D: {
        if (inputBufferRef.current.length === 0) {
          inputBufferRef.current = "";
          terminal.write("^D\r\n" + PROMPT);
          sshApiRef.current?.write({ cmd: KeyCodes.CTRL_D, processId });
        }
        return;
      }

      case KeyCodes.TAB: {
        terminal.write("  ");
        inputBufferRef.current += "  ";
        return;
      }

      case KeyCodes.ARROW_LEFT: {
        return;
      }

      case KeyCodes.ARROW_RIGHT: {
        return;
      }

      default: {
        const charCode = data.charCodeAt(0);
        if (charCode >= 32 && charCode <= 126) {
          inputBufferRef.current += data;
          terminal.write(data);
        }
        return;
      }
    }
  };

  const handleResize = useCallback(() => {
    const fitAddon = fitAddonRef.current;
    if (fitAddon) {
      setTimeout(() => fitAddon.fit(), 10);
    }
  }, []);

  function fit() {
    const fitAddon = fitAddonRef.current;
    if (fitAddon) {
      setTimeout(() => fitAddon.fit(), 10);
    } else {
      initializeTerminal();
    }
  }

  React.useEffect(() => {
    fit();
  }, [terminalState[processId.toString()]]);

  const clearTerminal = useCallback(() => {
    const terminal = termRef.current;
    if (terminal) {
      terminal.clear();
      terminal.write(PROMPT);
      inputBufferRef.current = "";
    }
  }, []);

  useEffect(() => {
    initializeTerminal();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      termRef.current?.dispose();
      termRef.current = null;
    };
  }, []);

  useEffect(() => {
    const terminal = termRef.current;

    if (
      listenersAttachedRef.current ||
      !terminal ||
      typeof window === "undefined"
    )
      return;
    listenersAttachedRef.current = true;
    setupSSHConnection();
  }, [termRef]);

  useEffect(() => {
    const terminal = termRef.current;
    if (!terminal) return;

    const disposable = terminal.onData(handleData);
    return () => disposable.dispose();
  }, [handleData]);

  useEffect(() => {
    const terminal = termRef.current;
    if (terminal) {
      terminal.scrollToBottom();
    }
  }, [terminalState]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold">Terminal</span>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                terminalState[processId.toString()]?.isConnected
                  ? "bg-green-500 animate-pulse"
                  : terminalState[processId.toString()]?.state === "errored"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            />
            <span className="text-xs opacity-75">
              {String(
                terminalState[processId.toString()]?.state
                  .charAt(0)
                  ?.toUpperCase() +
                  terminalState[processId.toString()]?.state?.slice(1),
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="px-2 py-1 text-xs rounded  hover:bg-accent transition-colors"
            disabled={
              terminalState[processId.toString()]?.state === "executing"
            }
          >
            Clear
          </button>
          <span className="text-xs opacity-50">
            {commandHistoryRef.current.length} commands
          </span>
        </div>
      </div>
      <div className="h-full min-h-[33svh] ">
        <div
          ref={containerRef}
          style={{
            backgroundColor: "transparent",
            height: "100%",
          }}
          className="h-full min-h-[33svh] max-h-[33svh] w-full bg-transparent!  "
          onClick={() => termRef.current?.focus()}
        />
      </div>

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>
          ↑/↓: History • Ctrl+C: Cancel • Tab: Complete • Enter: Execute
        </span>
        <span>{inputBufferRef.current.length} chars</span>
      </div>
    </div>
  );
};
