import FileSystem from "./FileSystem";
import path from "path";
import { isRelativeFilePath } from "../utils/file";
import type { Paths } from "./types";

export function findImports(paths: Paths) {
  return (importPath: string) => {
    let actualImportPath;

    if (isRelativeFilePath(importPath)) {
      actualImportPath = path.join(paths.sources, importPath);
    } else {
      actualImportPath = path.join(paths.root, "node_modules", importPath);
    }

    actualImportPath = path.resolve(actualImportPath);

    try {
      const importPathContent = FileSystem.readFile(actualImportPath);
      return { contents: importPathContent };
    } catch (e) {
      throw new Error(`File not found, ${actualImportPath}`);
    }
  };
}
