import { FaEthereum, FaJs, FaMarkdown, FaRegFolderOpen } from "react-icons/fa6";
import {
  FaFileAlt,
  FaReact,
  FaPython,
  FaJava,
  FaPhp,
  FaCss3Alt,
  FaSass,
} from "react-icons/fa";
import { FaFolder, FaRegFileAlt } from "react-icons/fa";
import {
  SiTypescript,
  SiJson,
  SiYaml,
  SiCplusplus,
  SiGo,
  SiRust,
  SiSwift,
  SiKotlin,
  SiRuby,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiNodedotjs,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiGit,
  SiGraphql,
  SiJest,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
} from "react-icons/si";
import { IconType } from "react-icons/lib";
import { BiCode } from "react-icons/bi";
import { TbBrandCpp } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";
import { RiFileTextLine } from "react-icons/ri";

export const FileIcons: Record<string, IconType> = {
  // Web technologies
  html: BiCode,
  css: FaCss3Alt,
  scss: FaSass,
  sass: FaSass,
  less: FaCss3Alt,

  // JavaScript/TypeScript ecosystem
  js: FaJs,
  jsx: FaReact,
  ts: SiTypescript,
  tsx: FaReact,
  mjs: FaJs,
  cjs: FaJs,

  // Frontend frameworks
  vue: SiVuedotjs,
  vuex: SiVuedotjs,
  svelte: SiSvelte,
  angular: SiAngular,

  // Configuration files
  json: SiJson,
  yaml: SiYaml,
  yml: SiYaml,
  toml: RiFileTextLine,
  env: RiFileTextLine,
  gitignore: SiGit,
  dockerfile: SiDocker,

  // Backend languages
  py: FaPython,
  java: FaJava,
  php: FaPhp,
  go: SiGo,
  rs: SiRust,
  rb: SiRuby,
  swift: SiSwift,
  kt: SiKotlin,

  // C-family languages
  c: TbBrandCpp,
  cpp: SiCplusplus,
  h: TbBrandCpp,
  hpp: SiCplusplus,

  // Blockchain
  sol: FaEthereum,

  // Documentation
  md: FaMarkdown,
  mdx: FaMarkdown,
  txt: RiFileTextLine,
  pdf: FaFileAlt,

  // Build tools & configs
  tsconfig: SiTypescript,
  package: SiNodedotjs,
  lock: SiNodedotjs,

  // Database
  sql: SiMysql,
  db: SiPostgresql,

  // Testing
  test: SiJest,
  spec: SiJest,

  // GraphQL
  gql: SiGraphql,
  graphql: SiGraphql,

  // Default fallbacks
  default: FaRegFileAlt,
  folder: FaFolder,
  folderOpen: FaRegFolderOpen,
};

export const FileColors: Record<string, string> = {
  // Web technologies
  html: "oklch(0.6423 0.2121 35.34)", // Orange
  css: "oklch(0.55 0.22 262)", // Blue
  scss: "oklch(0.65 0.18 330)", // Pink
  sass: "oklch(0.65 0.18 330)", // Pink
  less: "oklch(0.55 0.22 262)", // Blue

  // JavaScript/TypeScript ecosystem
  js: "oklch(0.91 0.17 98)", // Yellow
  jsx: "oklch(0.91 0.17 98)", // Yellow
  ts: "oklch(0.52 0.1825 247.63)", // Blue
  tsx: "oklch(0.52 0.1825 247.63)", // Blue
  mjs: "oklch(0.91 0.17 98)", // Yellow
  cjs: "oklch(0.91 0.17 98)", // Yellow

  // Frontend frameworks
  vue: "oklch(0.55 0.13 160)", // Green
  svelte: "oklch(0.65 0.18 15)", // Orange
  angular: "oklch(0.75 0.25 15)", // Red

  // Configuration files
  json: "oklch(0.85 0.12 90)", // Light yellow
  yaml: "oklch(0.65 0.10 200)", // Light blue
  yml: "oklch(0.65 0.10 200)", // Light blue
  toml: "oklch(0.70 0.12 280)", // Purple
  env: "oklch(0.60 0.15 150)", // Green
  gitignore: "oklch(0.40 0.10 0)", // Dark gray
  dockerfile: "oklch(0.55 0.18 240)", // Blue

  // Backend languages
  py: "oklch(0.65 0.20 100)", // Blue
  java: "oklch(0.65 0.22 30)", // Red/Orange
  php: "oklch(0.55 0.25 300)", // Purple
  go: "oklch(0.60 0.18 200)", // Cyan
  rs: "oklch(0.75 0.15 30)", // Orange/Brown
  rb: "oklch(0.70 0.25 0)", // Red
  swift: "oklch(0.70 0.22 40)", // Orange
  kt: "oklch(0.60 0.25 260)", // Purple

  // C-family languages
  c: "oklch(0.55 0.20 250)", // Blue
  cpp: "oklch(0.55 0.20 250)", // Blue
  cs: "oklch(0.60 0.25 320)", // Purple
  h: "oklch(0.55 0.20 250)", // Blue
  hpp: "oklch(0.55 0.20 250)", // Blue

  // Blockchain
  sol: "oklch(0.62 0.19 260)", // Purple

  // Documentation
  md: "oklch(0.70 0.15 250)", // Blue
  mdx: "oklch(0.70 0.15 250)", // Blue
  txt: "oklch(0.70 0.05 0)", // Gray
  pdf: "oklch(0.75 0.25 20)", // Red

  // Build tools & configs
  tsconfig: "oklch(0.52 0.1825 247.63)", // TypeScript blue
  package: "oklch(0.50 0.20 130)", // Green
  lock: "oklch(0.40 0.05 0)", // Dark gray

  // Database
  sql: "oklch(0.55 0.18 220)", // Blue
  db: "oklch(0.55 0.18 220)", // Blue

  // Testing
  test: "oklch(0.70 0.20 90)", // Red/Coral
  spec: "oklch(0.70 0.20 90)", // Red/Coral

  // GraphQL
  gql: "oklch(0.65 0.22 320)", // Pink
  graphql: "oklch(0.65 0.22 320)", // Pink

  // Default fallbacks
  default: "oklch(0.70 0.05 0)", // Gray
  folder: "oklch(0.80 0.12 90)", // Yellow
  folderOpen: "oklch(0.80 0.12 90)", // Yellow
};

// Helper function to get icon for a filename
export const getFileIcon = (filename: string): IconType => {
  const extension = filename.split(".").pop()?.toLowerCase() || "default";
  return FileIcons[extension] || FileIcons.default;
};

// Helper function to get color for a filename
export const getFileColor = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() || "default";
  return FileColors[extension] || FileColors.default;
};

export const GetExtension = (fileName: string) => {
  const parts = fileName.split(".");
  return parts.pop()?.toLowerCase() || "";
};

export const GetMonacoLanguage = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    default:
      return ext;
  }
};
