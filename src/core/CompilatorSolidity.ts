import solc from "solc";
import { findImports } from "./findImports";
import type {
  CompilationInput,
  CompilationMap,
  Compilator,
  Paths,
} from "./types";

export class CompilatorSolidity implements Compilator {
  readonly paths: Paths;

  constructor(paths: Paths) {
    this.paths = paths;
  }

  compile(input: CompilationInput): CompilationMap | null | undefined {
    let output: CompilationMap;

    try {
      output = JSON.parse(
        solc.compile(JSON.stringify(input), {
          import: (importPath: string) => findImports(this.paths)(importPath),
        })
      );
    } catch {
      return null;
    }

    return output;
  }
}
