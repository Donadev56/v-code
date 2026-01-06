"use client";

import { Folder } from "lucide-react";
import React from "react";
import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { FaEthereum, FaJs, FaMarkdown, FaRegFolderOpen } from "react-icons/fa6";
import { FaFileAlt, FaReact } from "react-icons/fa";
import { AutoSizer } from "react-virtualized-auto-sizer";

import { FaFolder } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { IconType } from "react-icons/lib";
import { BiCode } from "react-icons/bi";
import {
  FileColors,
  FileIcons,
  FolderColors,
  GetExtension,
  getFolderIcon,
} from "@/lib/files";
import { FileItem, OpenedFile } from "@/types/types";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import { cn } from "@/lib/utils";
import FileIcon from "./ui/file_icon";
import FolderIcon from "./ui/folder_icon";

function getFileIcon(fileName: string) {
  const extension = GetExtension(fileName);
  if (extension) {
    return FileIcons[extension] || FaRegFileAlt;
  }
  return FaRegFileAlt;
}

interface FileExplorerProps {
  onOpen: (node: NodeApi<FileItem>) => void;
  items: Record<string, FileItem>;
  currentFile: OpenedFile;
  onOpenDir: (node: NodeApi<FileItem>) => void;
}

export const FileExplorer = ({
  onOpen,
  items,
  onOpenDir,
  currentFile,
}: FileExplorerProps) => {
  const data = React.useMemo(() => buildTree(items), [items]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <AutoSizer
        renderProp={({ height, _ }: any) => (
          <Tree
            paddingBottom={40}
            data={data}
            openByDefault={false}
            width="100%"
            indent={18}
            height={height - 200}
            rowHeight={30}
            onSelect={(nodes) => {
              const node = nodes[0];
              if (node && !node.data.isFolder) {
                onOpen(node);
              } else {
                if (!node?.isOpen) {
                  return;
                }
                onOpenDir(node);
              }
            }}
          >
            {Node}
          </Tree>
        )}
      ></AutoSizer>
    </div>
  );
};
function Node({ node, style, dragHandle }: NodeRendererProps<FileItem>) {
  const { focusedFile } = useOpenEditor();
  const isCurrent = focusedFile.path === node.data.data.path;
  const indent = node.level == 0 ? "16px" : 24 * node.level;

  return (
    <div
      key={node.data.data.path}
      ref={dragHandle}
      onClick={() => node.toggle()}
      style={{ ...style, width: "100%", maxWidth: "100%", paddingLeft: indent }}
      className={cn(
        "flex items-center gap-2 px-2 cursor-pointer",
        isCurrent && "bg-foreground/20",
        " focus:bg-primary/20 cursor-pointer px-2 py-0.5 focus:border-primary ",
      )}
    >
      <NodeIcon size={18} node={node} />
      <div className="text-[14px] text-nowrap">{node.data.data.name}</div>
    </div>
  );
}

function buildTree(items: Record<string, any>, rootId = "root"): FileItem[] {
  const root = items[rootId];
  return root?.children?.map((id: string) => {
    const item = items[id];
    return {
      id: item.index,
      name: item.index,
      isFolder: item.isFolder,
      data: item.data,
      children: item.isFolder ? buildTree(items, item.index) : undefined,
    };
  });
}

export function NodeIcon({
  node,
  size = 20,
}: {
  node: NodeApi<FileItem>;
  size: number;
}) {
  const isOpen = node.isOpen;
  //const isRoot = node.isRoot
  const isInternal = node.isInternal;
  const isOpenFolder = isInternal && isOpen;
  const isFile = !isInternal;
  const isClosedFolder = !isFile && !isOpen;

  if (isOpenFolder) {
    return <FolderIcon size={size} path={node.data.data.path} isOpen={true} />;
  }
  if (isClosedFolder) {
    return <FolderIcon size={size} path={node.data.data.path} isOpen={false} />;
  }

  //if (isFile) {
  // Icon = getFileIcon(node.data.name);
  //}

  if (isFile) {
    return <FileIcon size={size} filePath={node.data.data.path} />;
  }
}


