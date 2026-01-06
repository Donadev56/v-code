// components/FileIcon.tsx
import { getIconUrlForFilePath } from "vscode-material-icons";

type Props = {
  filePath: string;
  size?: number;
};

export default function FileIcon({ filePath, size = 20 }: Props) {
  const iconUrl = getIconUrlForFilePath(filePath, "/material-icons");

  return <img src={iconUrl} alt={iconUrl} width={size} height={size} />;
}
