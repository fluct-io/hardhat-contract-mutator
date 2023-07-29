import {
  SOLIDITY_FILE_EXTENSION,
  getFileExtension,
  iterateFiles,
} from "../utils/file";
import path from "path";
import FileSystem from "./FileSystem";
import type { CompilationInput, CompilationInputSources, Paths } from "./types";

export class CompilationInputProviderSolidity {
  readonly paths: Paths;

  constructor(paths: Paths) {
    this.paths = paths;
  }

  provide(): CompilationInput {
    const sources: CompilationInputSources = {};

    for (const filePath of iterateFiles(this.paths.sources)) {
      if (getFileExtension(filePath) === SOLIDITY_FILE_EXTENSION) {
        const fileKey = path.relative(this.paths.sources, filePath);
        const fileContent = FileSystem.readFile(filePath);
        sources[fileKey] = { content: fileContent };
      }
    }

    const input: CompilationInput = {
      language: "Solidity",
      sources,
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    return input;
  }
}
