import { CodeEditor } from "@/components/editor-main/editor";
import EditorPage from "./(pages)/editor/page";
import {
  getIconForFilePath,
  getIconUrlByName,
  getIconUrlForFilePath,
  type MaterialIcon,
} from "vscode-material-icons";

export default function Home() {
  return <EditorPage />;
}
