"use client";

import { CodeEditor } from "@/components/editor-main/editor";
import { FileExplorer } from "@/components/file_explorer";
import Group from "@/components/ui/group";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import {
  FileColors,
  FileIcons,
  GetExtension,
  GetMonacoLanguage,
} from "@/lib/files";
import { cn, getKeyFromConfig, isImage } from "@/lib/utils";
import { buf, FileContent, FileItem, OpenedFile } from "@/types/types";
import { PlusIcon, SearchIcon, Trash2, X } from "lucide-react";
import React from "react";
import { Panel, Separator } from "react-resizable-panels";
import { AiTwotoneCode } from "react-icons/ai";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import { TerminalComponent } from "@/components/terminal";
import { IoClose, IoTerminalOutline } from "react-icons/io5";
import { toast } from "sonner";
import { TerminalButton, TerminalInput } from "@/components/editor_dialog";
import { EnterPathDialog } from "@/components/editor_inputs";
import { TerminalsView } from "@/components/terminal_view";
import { NodeApi } from "react-arborist";
import { TranslateX, TranslateY } from "@/components/translate";
import { Button } from "@/components/ui/button";
import { FaMinus } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";
import { EditorTopView } from "@/components/editor_top_editor_view";
import { TopLoader } from "@/components/top_loader";
import { useEditorDialog } from "@/hooks/useDialog";
import { EditorBottomView } from "@/components/editor_bottom_view";
import { EditorConfigPathsListView } from "@/components/editor_config_paths_view";
import FileIcon from "@/components/ui/file_icon";
import { BiError } from "react-icons/bi";
import { ImageViewer } from "@/components/editor-main/image_viewer";
import { EditorSpaceRenderer } from "@/components/editor-main/space_renderer";
import { fromString } from "uint8arrays/from-string";

export default function EditorPage() {
  const {
    focusedFile,
    setFocusedFile,
    isTerminalVisible,
    activeTerminalIds,
    setTerminalState,
    setIsTerminalVisible,
    addConnection,
    deleteTerminal,
    isSftpConnected,
    currentPath,
    setCurrentPath,
    updateFile,
    readFile,
    isLoading,
    config,
    localConfig,
    items,
    updateFolder,
    openedFiles,
    setOpenedFiles,
    writeFile,
    lastEditTime,
    setLastEditTime
  } = useOpenEditor();
  const [currentTerminalId, setCurrentTerminalId] = React.useState(0);
  const [isVisible, setVisible] = React.useState(false);
  const dialog = useEditorDialog();

  React.useEffect(() => {
    if (!isSftpConnected) {
      toast.error("SFTP not connected");
      return;
    }
    if (!config) {
      return;
    }
    const key = getKeyFromConfig(config);
    const data = localConfig[key];
    if (data) {
      if (data?.paths?.length > 0) {
        dialog.showDialog(<EditorConfigPathsListView />);
      } else {
        dialog.showDialog(<EnterPathDialog />);
      }
    }
  }, [isSftpConnected]);

  function removeFileFromBar(file: OpenedFile) {
    let rest: { [name: string]: OpenedFile } = {};
    let lastElementIndex = 0;
    setOpenedFiles((prev) => {
      lastElementIndex =
        Object.values(prev).findIndex((e) => e.path === file.path) - 1;
      const { [`${file.path}`]: _, ...r } = prev;
      rest = r;
      return rest;
    });

    setFocusedFile({ name: "", content: buf, path: "/" });
    if (Object.values(rest).length === 0) {
      return;
    }
    setFocusedFile(
      Object.values(rest).toReversed()[
        lastElementIndex < 0 ? 0 : lastElementIndex
      ],
    );
  }

  async function updateFileContent(data: {
    file: OpenedFile;
    newValue: string | undefined;
  }) {
    try {
      await writeFile(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addTerm() {
    try {
      const result = await addConnection();
      if (result.error) {
        throw result.error;
      }
      setCurrentTerminalId(result.process.processId);
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message ?? String(error));
    }
  }

  async function deleteTerm(processId: number) {
    try {
      if (activeTerminalIds.length > 1) {
        const index = activeTerminalIds.findIndex((e) => e === processId);
        if (index !== -1) {
          setCurrentTerminalId(activeTerminalIds[index - 1]);
        } else {
          setCurrentTerminalId(0);
        }
      } else {
        setCurrentTerminalId(0);
      }

      const result = await deleteTerminal(processId);
      if (result.success) {
        console.log("Termianl deleted");
        return;
      }
      throw new Error("Error while deleting terminal");
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message ?? String(error));
    }
  }
  const openFile = async (node: NodeApi<FileItem>) => {
    try {
      const item = node.data;

      if (!item.data.path) {
        throw new Error("Path not defined");
      }
      let content: FileContent = buf;
      if (!node.data.data.content) {
        const result = await updateFile(item.data.path);
        if (result) {
          content = result;
        }
      } else {
        content = node.data.data.content;
        updateFile(item.data.path, true);
      }
      const file = {
        name: item.data?.name || item.name,
        content: content,
        path: item.data.path,
      };
      setOpenedFiles((prev) => ({
        ...prev,
        [`${file.path}`]: file,
      }));
      setFocusedFile(file);
    } catch (error) {
      console.error(error);
    }
  };
  const onOpenDir = async (node: NodeApi<FileItem>) => {
    try {
      const item = node.data;

      if (!item.data.path) {
        throw new Error("Path not defined");
      }

      await updateFolder(item.data.path);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex relative w-full flex-col items-center h-svh  ">
      <EditorTopView />
      <div
        style={{
          maxHeight: "calc(100svh - 75px)",
          minHeight: "calc(100svh - 75px)",
        }}
        className="w-full relative p-4"
      >
        {isLoading && <TopLoader />}
        <Group
          // direction="horizontal"
          className="w-full h-full   border "
        >
          {Object.values(items).length > 0 && (
            <Panel defaultSize={180}>
              <TranslateX
                className="w-full"
                condition={Object.values(items).length > 0}
              >
                <div className="w-full py-4">
                  <div className="flex text-sm p-4 py-3 overflow-x-scroll">
                    Explorer
                  </div>

                  <FileExplorer
                    onOpenDir={onOpenDir}
                    items={items}
                    onOpen={openFile}
                  />
                </div>
              </TranslateX>
            </Panel>
          )}
          {Object.values(items).length > 0 && (
            <Separator className="h-full w-0.5 bg-border" />
          )}
          <Panel minSize={"30%"}>
            <div className="w-full relative h-full">
              {Object.values(openedFiles).length > 0 && (
                <div className="flex border-b z-1 relative bg-background/20 backdrop-blur-2xl scrollbar-hide items-center overflow-x-scroll">
                  {Object.values(openedFiles).map((e) => {
                    const isCurrent = focusedFile?.path === e.path;

                    return (
                      <div className="relative group ">
                        <div
                          onClick={() => setFocusedFile(e)}
                          className={cn(
                            "px-4 py-1.5 w-full  text-nowrap pr-8 max-h-8.75 cursor-pointer hover:bg-muted/20 transition-all flex items-center gap-2  border",
                            isCurrent && "border-t-primary",
                          )}
                        >
                          <FileIcon size={16} filePath={e.path} />
                          <div className="text-sm">{e.name} </div>
                        </div>
                        <X
                          onClick={() => removeFileFromBar(e)}
                          size={20}
                          className=" text-transparent! group-hover:text-gray-400/70! hover:text-foreground absolute top-1/5 right-1.5 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="w-full relative h-full">
                {focusedFile && focusedFile?.content.length > 0 ? (
                  <EditorSpaceRenderer
                    updateFileContent={updateFileContent}
                    file={focusedFile}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center ">
                    <AiOutlineCodeSandbox
                      className="text-gray-400"
                      size={145}
                    />
                  </div>
                )}
                <TranslateY condition={isTerminalVisible}>
                  <div className="absolute bottom-5 z-10 flex max-h-[45svh]    w-full flex-col gap-2 border-t bg-card/95 backdrop-blur-sm  p-4 font-mono">
                    <div className="w-full relative h-full justify-between flex gap-2 ">
                      <TerminalsView
                        setCurrentTerminalId={setCurrentTerminalId}
                        currentTerminalId={currentTerminalId}
                      />

                      <div className=" min-w-14 w-14 overflow-scroll pb-40 relative gap-3 my-4 p-4 flex max-h-[33svh]  min-h-[33svh]  justify-end bottom-5  z-10 ">
                        <div className="flex gap-1 flex-col">
                          {[...activeTerminalIds, -1, -2].map((id) => {
                            const isCurrent = id === currentTerminalId;

                            if (id === -1) {
                              return (
                                <div
                                  key={id}
                                  onClick={addTerm}
                                  className={cn(
                                    "p-2 items-center fixed bg-muted bottom-15 rounded  mt-3 max-w-[40px] max-h-[40px] flex justify-center",
                                  )}
                                >
                                  <PlusIcon size={20} />
                                </div>
                              );
                            }
                            if (id === -2) {
                              return (
                                <div
                                  key={id}
                                  onClick={() => deleteTerm(currentTerminalId)}
                                  className={cn(
                                    "p-2 items-center fixed bg-destructive/20 text-destructive bottom-5 rounded  mt-3 max-w-[40px] max-h-[40px] flex justify-center",
                                  )}
                                >
                                  <Trash2 size={20} />
                                </div>
                              );
                            }

                            return (
                              <div
                                key={id}
                                onClick={() => setCurrentTerminalId(id)}
                                className={cn(
                                  "p-2 items-center  max-w-[40px] max-h-[40px] flex justify-center",
                                  isCurrent && "border-primary border",
                                )}
                              >
                                <IoTerminalOutline />
                              </div>
                            );
                          })}

                          <div className="h-20 min-h-20  w-full "></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TranslateY>
              </div>
            </div>
          </Panel>
        </Group>
      </div>
      <EditorBottomView />
    </div>
  );
}
