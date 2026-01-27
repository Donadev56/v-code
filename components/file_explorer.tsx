"use client";

import { FileCodeIcon, Folder } from "lucide-react";
import React, { JSX } from "react";
import {
  NodeApi,
  NodeRendererProps,
  RenameHandler,
  Tree,
} from "react-arborist";
import { FaEthereum, FaJs, FaMarkdown, FaRegFolderOpen } from "react-icons/fa6";
import { FaFileAlt, FaReact } from "react-icons/fa";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { FaFile } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { CiFolderOn } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";
import { FaRegFile } from "react-icons/fa";
import { FaRegFolder } from "react-icons/fa";

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
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { CgChevronRight } from "react-icons/cg";

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
  onOpenDir: (node: NodeApi<FileItem>) => void;
  onRename: RenameHandler<FileItem>;
}

export const FileExplorer = ({
  onOpen,
  items,
  onOpenDir,
  onRename,
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
            onRename={onRename}
            onSelect={(nodes) => {
              const node = nodes[0];
              if (node && !node.data.isFolder) {
                onOpen(node);
              } else {
                if (!node?.isOpen || items[node.data.data.path].children.length > 0) {
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

type NodeComponentProps = {
  node: NodeApi<FileItem>;
  setCurrentComponentView: React.Dispatch<React.SetStateAction<string>>;
};
const NodeIconComponent = ({ node }: { node: NodeApi<FileItem> }) => (
  <NodeIcon size={16} node={node} />
);

const NodeFileComponent = ({ node }: { node: NodeApi<FileItem> }) => {
  return (
    <div className={cn("flex items-center gap-2 px-2 w-full cursor-pointer")}>
      {node.data.isFolder && (
        <div className="text-muted-foreground!">
          {node.isOpen ? <IoChevronDownSharp size={13} /> : <CgChevronRight />}
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-2 ",
          !node.data.isFolder && "pl-[25px] ",
        )}
      >
        <NodeIconComponent node={node} />
        <div className="text-[14px] text-nowrap">{node.data.data.name}</div>
      </div>
    </div>
  );
};
const EditView = ({ node, setCurrentComponentView }: NodeComponentProps) => {
  const [newName, setNewName] = React.useState(node.data.data.name);
  const [isFocus, setIsFocus] = React.useState(false);
  const [wasFocus, setWasFocus] = React.useState(false);

  React.useEffect(() => {
    if (isFocus) {
      setWasFocus(true);
    }

    if (!isFocus && wasFocus) {
      checkAndSaveName();
    }
  }, [isFocus]);

  async function checkAndSaveName() {
    try {
      if (newName?.trim() && newName !== node.data.data.name) {
        console.log(
          "Name has changed from ",
          node.data.data.name,
          " to ",
          newName,
        );
      } else {
        console.log("Name not changed or empty");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentComponentView("default");
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <NodeIconComponent node={node} />
      <input
        className="w-full focus:outline-0 focus:border-primary text-sm px-1.5 py-0.5 border border-primary "
        onBlur={() => setIsFocus(false)}
        onFocus={() => setIsFocus(true)}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="type..."
        type="text"
        autoFocus
      />
    </div>
  );
};

const DefaultChildren = ({
  node,
  setCurrentComponentView,
}: NodeComponentProps) => (
  <>
    <NodeFileComponent node={node} />
    <div
      className={cn(
        " justify-end gap-2 items-center hidden text-muted-foreground!  px-2  ",
        "group-hover:flex ",
      )}
    >
      <div className={cn("flex gap-2 items-center")}>
        <FaRegFolder className="hover:text-primary!" stroke="5px" size={13} />
        <FaRegFile className="hover:text-primary!" stroke="5px" size={11} />
      </div>
      <div className="flex gap-2 items-center ">
        <MdOutlineModeEdit
          className="hover:text-primary!"
          onClick={() => setCurrentComponentView("edit")}
          size={13}
        />
        <IoTrashOutline className="hover:text-red-400!" size={13} />
      </div>
    </div>
  </>
);
function Node({ node, style, dragHandle }: NodeRendererProps<FileItem>) {
  const { focusedFile } = useOpenEditor();
  const isCurrent = focusedFile?.path === node.data.data.path;
  const indent = node.level == 0 ? "16px" : 24 * node.level;
  const [currentComponentView, setCurrentComponentView] =
    React.useState("default");

  const children: {
    [x: string]: ({
      node,
      setCurrentComponentView,
    }: NodeComponentProps) => JSX.Element;
  } = {
    default: DefaultChildren,
    edit: EditView,
  };

  const Component = React.useMemo(
    () => children[currentComponentView],
    [currentComponentView],
  );

  return (
    <div
      onKeyUp={(e) => {
        console.log(e);
      }}
      onKeyDown={(e) => {
        console.log(e.key);
        if (e.key === "Enter") {
          setCurrentComponentView("edit");
        }
      }}
      key={node.data.data.path}
      ref={dragHandle}
      onClick={() => node.toggle()}
      style={{ ...style, width: "100%", maxWidth: "100%", paddingLeft: indent }}
      className={cn(
        "flex  hover:bg-muted focus:bg-primary/20 focus:border-primary justify-between cursor-pointer group",
        isCurrent && "bg-foreground/20",
        " focus:bg-primary/20 cursor-pointer px-2 py-0.5 focus:border-primary ",
      )}
    >
      <Component
        setCurrentComponentView={setCurrentComponentView}
        node={node}
      />
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
