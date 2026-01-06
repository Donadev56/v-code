"use client";

import { Folder } from "lucide-react";
import React from "react";
import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { FaEthereum, FaJs, FaMarkdown, FaRegFolderOpen } from "react-icons/fa6";
import { FaFileAlt, FaReact } from "react-icons/fa";

import { FaFolder } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { IconType } from "react-icons/lib";
import { BiCode } from "react-icons/bi";
import { FileColors, FileIcons, GetExtension } from "@/lib/files";
import { FileItem, OpenedFile } from "@/types/types";
import { useOpenEditor } from "@/hooks/useOpenEditor";
import { cn } from "@/lib/utils";

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
    <div
      style={{
        maxHeight: "calc(100svh - 75px)",
        minHeight: "calc(100svh - 75px)",
      }}
      className="w-full full  overflow-y-scroll"
    >
      <Tree
        paddingBottom={40}
        data={data}
        openByDefault={false}
        width="100%"
        indent={18}
        height={1000}
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
    </div>
  );
};
function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  const { focusedFile } = useOpenEditor();
  const isCurrent = focusedFile.name === node.data.name;
  const indent = node.level == 0 ? "16px" : 24 * node.level;

  return (
    <div
      ref={dragHandle}
      onClick={() => node.toggle()}
      style={{ ...style, width: "100%", maxWidth: "100%", paddingLeft: indent }}
      className={cn(
        "flex items-center gap-2 px-2 cursor-pointer",
        isCurrent && "bg-foreground/20",
        " focus:bg-primary/20 cursor-pointer px-2 py-0.5 focus:border-primary ",
      )}
    >
      <NodeIcon size={15} node={node} />
      <div className="text-[14px]">{node.data.name}</div>
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

function NodeIcon({
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
  const color = FileColors[GetExtension(node.data.name)];
  const isFolder = isOpenFolder || isClosedFolder;
  let Icon = FaRegFileAlt;
  const folderColor = "oklch(0.7533 0 333.4)";

  if (isOpenFolder) {
    Icon = FaRegFolderOpen;
  }
  if (isClosedFolder) {
    Icon = FaFolder;
  }

  if (isFile) {
    Icon = getFileIcon(node.data.name);
  }

  return <Icon size={size} color={isFolder ? folderColor : color} />;
}
