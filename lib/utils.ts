import { LOCAL_SSH_CONFIG, SSH_CONFIG, SupportedFileType } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import path from "path";
import { twMerge } from "tailwind-merge";
import { fromString } from "uint8arrays/from-string";
import { SupportedEncodings, toString } from "uint8arrays/to-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TerminalOptions = {
  cursorBlink: true,
  fontFamily: "'Courier New', monospace",
  fontSize: 14,
  lineHeight: 1.2,
  theme: {
    background: "#00000000",
    foreground: "var(--foreground)",
    cursor: "var(--primary)",
  },
  allowTransparency: true,
  disableStdin: false,
};
export const KeyCodes = {
  ENTER: "\r",
  BACKSPACE: "\b",
  DELETE: "\x7f",
  ARROW_UP: "\x1b[A",
  ARROW_DOWN: "\x1b[B",
  ARROW_LEFT: "\x1b[D",
  ARROW_RIGHT: "\x1b[C",
  CTRL_C: "\x03",
  CTRL_D: "\x04",
  TAB: "\t",
} as const;

export function isImage(filePath: string): boolean {
  const ext = filePath.split(".").pop()?.toLowerCase();

  if (!ext) return false;

  return [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
    "bmp",
    "ico",
    "tiff",
    "avif",
  ].includes(ext);
}

export function isPdf(filePath: string): boolean {
  const ext = filePath.split(".").pop()?.toLowerCase();

  if (!ext) return false;
  return ["pdf"].includes(ext);
}

export function getMimeType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();

  if (!ext) return "application/octet-stream";

  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    ico: "image/x-icon",
    tiff: "image/tiff",
    avif: "image/avif",

    pdf: "application/pdf",
    json: "application/json",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    ts: "text/typescript",
  };

  return map[ext] ?? "application/octet-stream";
}

export function Utf8ToBase64(data: string) {
  return Buffer.from(data, "utf8").toString("base64");
}

export const PROMPT = "$ ";

export function isPaste(data: string) {
  return data.startsWith("\x1b[200~") && data.endsWith("\x1b[201~");
}

export const GetPath = (dir: string, name: string) => {
  return path.posix.join(dir, name);
};

export function Uint8ArrayToString(
  data: Uint8Array,
  encoding: SupportedEncodings = "utf-8",
) {
  return toString(data, encoding);
}

export function ParseFile(data: string) {
  return JSON.parse(data, (key, value) => {
    if (key === "content") {
      return fromString(value, "base64");
    }
    return value;
  });
}

export function StringifyFile(data: any) {
  return JSON.stringify(data, (key, value) => {
    if (key === "content") {
      return toString(value, "base64");
    }
    return value;
  });
}

export function getFileRendererTypeByPath(path: string): SupportedFileType {
  const isFileImage = isImage(path);
  const isFilePdf = isPdf(path);
  if (isFileImage) {
    return "image";
  }
  if (isFilePdf) {
    return "pdf";
  }

  return "text";
}
export function getKeyFromConfig(config: SSH_CONFIG | LOCAL_SSH_CONFIG) {
  return `${config?.user}@${config?.host}`;
}

export function utf8StringToUint8Array(str: string) {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}
