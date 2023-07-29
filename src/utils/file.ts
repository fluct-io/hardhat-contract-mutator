import path from "path";
import FileSystem from "../core/FileSystem";

export const SOLIDITY_FILE_EXTENSION = "sol";

export function* iterateFiles(dirPath: string): IterableIterator<string> {
  const currentFileNames = FileSystem.readDir(dirPath);

  for (let i = 0; i < currentFileNames.length; i++) {
    const currentFileName = currentFileNames[i];
    const currentFilePath = path.join(dirPath, currentFileName);
    const currentFileStats = FileSystem.stat(currentFilePath);
    if (currentFileStats.isDirectory()) {
      yield* iterateFiles(currentFilePath);
    } else if (currentFileStats.isFile()) {
      yield currentFilePath;
    }
  }
}

export function isRelativeFilePath(filePath: string) {
  return (
    filePath.startsWith("./") ||
    filePath.startsWith("/") ||
    filePath.startsWith("../")
  );
}

export function getContractFileName(contractName: string) {
  return `${contractName}.sol`;
}

export function getFileExtension(filename: string) {
  return filename.split(".").pop();
}
