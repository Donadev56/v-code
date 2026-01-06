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
  html: "oklch(0.68 0.18 35)", // Warm coral orange
  css: "oklch(0.63 0.16 260)", // Soft periwinkle blue
  scss: "oklch(0.68 0.14 330)", // Gentle pink
  sass: "oklch(0.68 0.14 330)", // Gentle pink
  less: "oklch(0.63 0.16 260)", // Soft periwinkle blue

  // JavaScript/TypeScript ecosystem
  js: "oklch(0.85 0.18 95)", // Warm honey yellow
  jsx: "oklch(0.85 0.18 95)", // Warm honey yellow
  ts: "oklch(0.60 0.16 245)", // Softer sky blue
  tsx: "oklch(0.60 0.16 245)", // Softer sky blue
  mjs: "oklch(0.85 0.18 95)", // Warm honey yellow
  cjs: "oklch(0.85 0.18 95)", // Warm honey yellow

  // Frontend frameworks
  vue: "oklch(0.70 0.15 160)", // Mint green
  svelte: "oklch(0.72 0.16 20)", // Soft coral
  angular: "oklch(0.68 0.18 15)", // Warm terra cotta

  // Configuration files
  json: "oklch(0.82 0.12 85)", // Pale goldenrod
  yaml: "oklch(0.72 0.12 200)", // Soft seafoam
  yml: "oklch(0.72 0.12 200)", // Soft seafoam
  toml: "oklch(0.68 0.14 280)", // Lavender
  env: "oklch(0.70 0.14 140)", // Sage green
  gitignore: "oklch(0.3618 0.111 0)", // Charcoal gray
  dockerfile: "oklch(0.65 0.14 235)", // Denim blue

  // Backend languages
  py: "oklch(0.70 0.14 200)", // Azure blue
  java: "oklch(0.68 0.16 30)", // Burnt orange
  php: "oklch(0.65 0.18 300)", // Lilac purple
  go: "oklch(0.70 0.16 195)", // Aqua cyan
  rs: "oklch(0.75 0.12 25)", // Peach
  rb: "oklch(0.72 0.18 355)", // Soft ruby
  swift: "oklch(0.74 0.18 35)", // Apricot
  kt: "oklch(0.65 0.20 275)", // Orchid

  // C-family languages
  c: "oklch(0.65 0.16 250)", // Steel blue
  cpp: "oklch(0.65 0.16 250)", // Steel blue
  cs: "oklch(0.68 0.18 320)", // Soft magenta
  h: "oklch(0.65 0.16 250)", // Steel blue
  hpp: "oklch(0.65 0.16 250)", // Steel blue

  // Blockchain
  sol: "oklch(0.68 0.16 265)", // Amethyst

  // Documentation
  md: "oklch(0.72 0.12 245)", // Powder blue
  mdx: "oklch(0.72 0.12 245)", // Powder blue
  txt: "oklch(0.75 0.04 0)", // Light charcoal
  pdf: "oklch(0.72 0.18 20)", // Salmon pink

  // Build tools & configs
  tsconfig: "oklch(0.60 0.16 245)", // Consistent with TS
  package: "oklch(0.70 0.18 135)", // Emerald green
  lock: "oklch(0.55 0.04 0)", // Charcoal gray

  // Database
  sql: "oklch(0.65 0.14 220)", // Cerulean
  db: "oklch(0.65 0.14 220)", // Cerulean

  // Testing
  test: "oklch(0.72 0.16 90)", // Coral pink
  spec: "oklch(0.72 0.16 90)", // Coral pink

  // GraphQL
  gql: "oklch(0.70 0.18 325)", // Blush pink
  graphql: "oklch(0.70 0.18 325)", // Blush pink

  // Default fallbacks
  default: "oklch(0.75 0.04 0)", // Light charcoal
  folder: "oklch(0.82 0.12 95)", // Pale honey
  folderOpen: "oklch(0.82 0.12 95)", // Pale honey
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
