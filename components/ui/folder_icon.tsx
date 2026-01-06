import * as Icons from "vscode-material-icons";

type Props = {
  path: string;
  isOpen: boolean;
  size?: number;
};

export default function FolderIcon({ path, isOpen, size = 20 }: Props) {
  const name = Icons.getIconForDirectoryPath(path);
  const iconName = isOpen ? `${name}-open` : name;

  const iconUrl = Icons.getIconUrlByName(iconName as any, "/material-icons");

  return (
    <img
      src={iconUrl}
      alt=""
      width={size}
      height={size}
      style={{ verticalAlign: "middle" }}
    />
  );
}
