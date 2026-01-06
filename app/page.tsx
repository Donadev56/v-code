import { CodeEditor } from "@/components/editor";
import EditorPage from "./(pages)/editor/page";
import {
  getIconForFilePath,
  getIconUrlByName,
  getIconUrlForFilePath,
  type MaterialIcon,
} from "vscode-material-icons";

export default function Home() {
  const ICONS_URL = "vscode-material-icons/generated/icons";

  // example 1: file path -> image URL
  const iconUrl: string = getIconUrlForFilePath("src/index.html", ICONS_URL);

  // example 2: file path -> icon name
  const icon: MaterialIcon = getIconForFilePath("src/app/app.component.ts");

  // example 3: icon name -> image URL
  const tsIconUrl: string = getIconUrlByName("typescript", ICONS_URL);
  console.log({ icon, iconUrl, tsIconUrl });

  return <EditorPage />;
}
