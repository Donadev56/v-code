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

export interface FolderIconSet {
  open: IconType;
  closed: IconType;
}

export const FolderIcons: Record<string, FolderIconSet> = {
  // Common project folders
  src: { open: FaRegFolderOpen, closed: FaFolder },
  public: { open: FaRegFolderOpen, closed: FaFolder },
  components: { open: FaRegFolderOpen, closed: FaReact },
  pages: { open: FaRegFolderOpen, closed: SiNextdotjs },
  app: { open: FaRegFolderOpen, closed: SiNextdotjs },
  api: { open: FaRegFolderOpen, closed: SiNodedotjs },
  routes: { open: FaRegFolderOpen, closed: SiNodedotjs },
  utils: { open: FaRegFolderOpen, closed: BiCode },
  lib: { open: FaRegFolderOpen, closed: BiCode },
  hooks: { open: FaRegFolderOpen, closed: FaReact },
  context: { open: FaRegFolderOpen, closed: FaReact },
  store: { open: FaRegFolderOpen, closed: SiVuedotjs },
  redux: { open: FaRegFolderOpen, closed: FaReact },
  models: { open: FaRegFolderOpen, closed: SiMongodb },
  schemas: { open: FaRegFolderOpen, closed: SiGraphql },
  types: { open: FaRegFolderOpen, closed: SiTypescript },
  interfaces: { open: FaRegFolderOpen, closed: SiTypescript },

  // Configuration folders
  config: { open: FaRegFolderOpen, closed: SiYaml },
  configurations: { open: FaRegFolderOpen, closed: SiYaml },
  settings: { open: FaRegFolderOpen, closed: SiYaml },

  // Build and deployment
  dist: { open: FaRegFolderOpen, closed: SiVite },
  build: { open: FaRegFolderOpen, closed: SiVite },
  out: { open: FaRegFolderOpen, closed: SiNextdotjs },
  docker: { open: FaRegFolderOpen, closed: SiDocker },
  deployment: { open: FaRegFolderOpen, closed: SiDocker },
  scripts: { open: FaRegFolderOpen, closed: FaPython },
  bin: { open: FaRegFolderOpen, closed: FaPython },

  // Testing
  tests: { open: FaRegFolderOpen, closed: SiJest },
  __tests__: { open: FaRegFolderOpen, closed: SiJest },
  spec: { open: FaRegFolderOpen, closed: SiJest },
  test: { open: FaRegFolderOpen, closed: SiJest },
  testing: { open: FaRegFolderOpen, closed: SiJest },

  // Documentation
  docs: { open: FaRegFolderOpen, closed: FaMarkdown },
  documentation: { open: FaRegFolderOpen, closed: FaMarkdown },
  guides: { open: FaRegFolderOpen, closed: FaMarkdown },

  // Assets
  assets: { open: FaRegFolderOpen, closed: FaFileAlt },
  images: { open: FaRegFolderOpen, closed: FaFileAlt },
  icons: { open: FaRegFolderOpen, closed: FaFileAlt },
  fonts: { open: FaRegFolderOpen, closed: FaFileAlt },
  styles: { open: FaRegFolderOpen, closed: FaCss3Alt },
  css: { open: FaRegFolderOpen, closed: FaCss3Alt },
  scss: { open: FaRegFolderOpen, closed: FaSass },
  sass: { open: FaRegFolderOpen, closed: FaSass },

  // Node.js specific
  node_modules: { open: FaRegFolderOpen, closed: SiNodedotjs },
  modules: { open: FaRegFolderOpen, closed: SiNodedotjs },

  // Version control
  git: { open: FaRegFolderOpen, closed: SiGit },
  github: { open: FaRegFolderOpen, closed: SiGit },
  gitlab: { open: FaRegFolderOpen, closed: SiGit },

  // Database
  database: { open: FaRegFolderOpen, closed: SiPostgresql },
  db: { open: FaRegFolderOpen, closed: SiPostgresql },
  migrations: { open: FaRegFolderOpen, closed: SiMysql },
  seeds: { open: FaRegFolderOpen, closed: SiMysql },

  // Backend specific
  controllers: { open: FaRegFolderOpen, closed: SiNodedotjs },
  services: { open: FaRegFolderOpen, closed: SiNodedotjs },
  middleware: { open: FaRegFolderOpen, closed: SiNodedotjs },
  repositories: { open: FaRegFolderOpen, closed: SiMongodb },

  // Frontend frameworks
  views: { open: FaRegFolderOpen, closed: SiVuedotjs },
  templates: { open: FaRegFolderOpen, closed: SiSvelte },
  layouts: { open: FaRegFolderOpen, closed: SiNextdotjs },

  // Default fallback
  default: { open: FaRegFolderOpen, closed: FaFolder },
};

export const FolderColors: Record<string, string> = {
  // Common project folders
  src: "oklch(0.78 0.16 85)", // Soft gold
  public: "oklch(0.75 0.14 120)", // Muted teal
  components: "oklch(0.72 0.18 210)", // React blue
  pages: "oklch(0.70 0.16 280)", // Next.js purple
  app: "oklch(0.70 0.16 280)", // Next.js purple
  api: "oklch(0.68 0.15 140)", // Node.js green
  routes: "oklch(0.68 0.15 140)", // Node.js green
  utils: "oklch(0.76 0.12 60)", // Utility amber
  lib: "oklch(0.76 0.12 60)", // Utility amber
  hooks: "oklch(0.72 0.18 210)", // React blue
  context: "oklch(0.72 0.18 210)", // React blue
  store: "oklch(0.70 0.15 160)", // Vuex green
  redux: "oklch(0.72 0.18 210)", // React blue
  models: "oklch(0.65 0.14 220)", // Database blue
  schemas: "oklch(0.70 0.18 325)", // GraphQL pink
  types: "oklch(0.60 0.16 245)", // TypeScript blue
  interfaces: "oklch(0.60 0.16 245)", // TypeScript blue

  // Configuration folders
  config: "oklch(0.72 0.12 200)", // Config seafoam
  configurations: "oklch(0.72 0.12 200)", // Config seafoam
  settings: "oklch(0.72 0.12 200)", // Config seafoam

  // Build and deployment
  dist: "oklch(0.74 0.14 300)", // Build purple
  build: "oklch(0.74 0.14 300)", // Build purple
  out: "oklch(0.74 0.14 300)", // Build purple
  docker: "oklch(0.65 0.14 235)", // Docker blue
  deployment: "oklch(0.65 0.14 235)", // Docker blue
  scripts: "oklch(0.70 0.14 200)", // Python blue
  bin: "oklch(0.70 0.14 200)", // Python blue

  // Testing
  tests: "oklch(0.72 0.16 90)", // Test coral
  __tests__: "oklch(0.72 0.16 90)", // Test coral
  spec: "oklch(0.72 0.16 90)", // Test coral
  test: "oklch(0.72 0.16 90)", // Test coral
  testing: "oklch(0.72 0.16 90)", // Test coral

  // Documentation
  docs: "oklch(0.72 0.12 245)", // Documentation blue
  documentation: "oklch(0.72 0.12 245)", // Documentation blue
  guides: "oklch(0.72 0.12 245)", // Documentation blue

  // Assets
  assets: "oklch(0.75 0.10 40)", // Asset orange
  images: "oklch(0.75 0.10 40)", // Asset orange
  icons: "oklch(0.75 0.10 40)", // Asset orange
  fonts: "oklch(0.75 0.10 40)", // Asset orange
  styles: "oklch(0.63 0.16 260)", // CSS blue
  css: "oklch(0.63 0.16 260)", // CSS blue
  scss: "oklch(0.68 0.14 330)", // Sass pink
  sass: "oklch(0.68 0.14 330)", // Sass pink

  // Node.js specific
  node_modules: "oklch(0.68 0.15 140)", // Node green
  modules: "oklch(0.68 0.15 140)", // Node green

  // Version control
  git: "oklch(0.3618 0.111 0)", // Git charcoal
  github: "oklch(0.3618 0.111 0)", // Git charcoal
  gitlab: "oklch(0.3618 0.111 0)", // Git charcoal

  // Database
  database: "oklch(0.65 0.14 220)", // Database blue
  db: "oklch(0.65 0.14 220)", // Database blue
  migrations: "oklch(0.68 0.12 180)", // Migration teal
  seeds: "oklch(0.68 0.12 180)", // Migration teal

  // Backend specific
  controllers: "oklch(0.70 0.14 30)", // Controller amber
  services: "oklch(0.70 0.14 30)", // Service amber
  middleware: "oklch(0.70 0.14 30)", // Middleware amber
  repositories: "oklch(0.65 0.14 220)", // Repository blue

  // Frontend frameworks
  views: "oklch(0.70 0.15 160)", // Vue green
  templates: "oklch(0.72 0.16 20)", // Svelte coral
  layouts: "oklch(0.70 0.16 280)", // Layout purple

  // Default fallback
  default: "oklch(0.82 0.12 95)", // Default folder honey
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

// Helper function to get icon for a folder name
export const getFolderIcon = (
  folderName: string,
  isOpen: boolean = false,
): IconType => {
  const normalizedName = folderName.toLowerCase();
  const folderIconSet = FolderIcons[normalizedName] || FolderIcons.default;
  return isOpen ? folderIconSet.open : folderIconSet.closed;
};

// Helper function to get color for a folder name
export const getFolderColor = (folderName: string): string => {
  const normalizedName = folderName.toLowerCase();
  return FolderColors[normalizedName] || FolderColors.default;
};

export const GetExtension = (fileName: string) => {
  const parts = fileName.split(".");
  return parts.pop()?.toLowerCase() || "";
};

export const GetMonacoLanguage = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "mjs":
      return "js";
    default:
      return ext;
  }
};
