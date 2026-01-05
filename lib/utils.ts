import { clsx, type ClassValue } from "clsx";
import path from "path";
import { twMerge } from "tailwind-merge";

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

export const items: Record<string, any> = {
  root: {
    index: "root",
    path: "",
    isFolder: true,
    children: ["src", "public", "package.json"],
  },

  // ===== src =====
  src: {
    index: "src",
    path: "src",
    isFolder: true,
    children: ["App.jsx", "main.jsx", "components"],
  },

  components: {
    index: "components",
    path: "src/components",
    isFolder: true,
    children: ["Header.jsx", "Footer.jsx"],
  },

  "App.jsx": {
    index: "App.jsx",
    path: "src/App.jsx",
    isFolder: false,
    data: {
      content: `
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div>
      <Header />
      <main>
        <h1>Hello from App.jsx!</h1>
      </main>
      <Footer />
    </div>
  );
}
      `.trim(),
    },
  },

  "main.jsx": {
    index: "main.jsx",
    path: "src/main.jsx",
    isFolder: false,
    data: {
      content: `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
      `.trim(),
    },
  },

  "Header.jsx": {
    index: "Header.jsx",
    path: "src/components/Header.jsx",
    isFolder: false,
    data: {
      content: `
import React from "react";

export default function Header() {
  return (
    <header>
      <h2>My App Header</h2>
    </header>
  );
}
      `.trim(),
    },
  },

  "Footer.jsx": {
    index: "Footer.jsx",
    path: "src/components/Footer.jsx",
    isFolder: false,
    data: {
      content: `
import React from "react";

export default function Footer() {
  return (
    <footer>
      <p>© 2026 My Project</p>
    </footer>
  );
}
      `.trim(),
    },
  },

  // ===== public =====
  public: {
    index: "public",
    path: "public",
    isFolder: true,
    children: ["index.html", "favicon.ico"],
  },

  "index.html": {
    index: "index.html",
    path: "public/index.html",
    isFolder: false,
    data: {
      content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Project</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
      `.trim(),
    },
  },

  "favicon.ico": {
    index: "favicon.ico",
    path: "public/favicon.ico",
    isFolder: false,
    data: { content: "binary data placeholder" },
  },

  // ===== root files =====
  "package.json": {
    index: "package.json",
    path: "package.json",
    isFolder: false,
    data: {
      content: `
{
  "name": "my-project",
  "version": "1.0.0",
  "main": "src/main.jsx",
  "scripts": {
    "start": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
      `.trim(),
    },
  },
};

export const PROMPT = "$ ";

export function isPaste(data: string) {
  return data.startsWith("\x1b[200~") && data.endsWith("\x1b[201~");
}

export const GetPath = (dir: string, name: string) => {
  return path.posix.join(dir, name);
};
