import path from "path";
import {
  ASTReader,
  ASTWriter,
  DefaultASTWriterMapping,
  LatestCompilerVersion,
  PrettyFormatter,
  compileSol,
} from "solc-typed-ast";
import type { CompilationInputSources, Mutation, Paths } from "./types";
import { getContractFileName } from "../utils/file";

export class ConstantMutation implements Mutation {
  readonly contractName: string;
  readonly paths: Paths;
  private readonly newValues: Map<string, { value: string }>;

  constructor(paths: Paths, contractName: string) {
    this.contractName = contractName;
    this.paths = paths;
    this.newValues = new Map();
  }

  getConstant(name: string) {
    return this.newValues.get(name);
  }

  setConstant(name: string, info: { value: string }) {
    this.newValues.set(name, info);
  }

  async mutate(
    sources: CompilationInputSources
  ): Promise<CompilationInputSources | null | undefined> {
    const fileName = getContractFileName(this.contractName);
    const fileAbsolutePath = path.join(this.paths.sources, fileName);
    const raw = await compileSol(fileAbsolutePath, "auto", {
      basePath: this.paths.sources,
    });
    const reader = new ASTReader();
    const sourceUnits = reader.read(raw.data);

    const formatter = new PrettyFormatter(4, 0);
    const writer = new ASTWriter(
      DefaultASTWriterMapping,
      formatter,
      raw.compilerVersion ? raw.compilerVersion : LatestCompilerVersion
    );
    const sourceUnit = sourceUnits.find(
      (x) => x.absolutePath === fileAbsolutePath
    );
    if (!sourceUnit) {
      return null;
    }

    sourceUnit.walk((node: any) => {
      if (node.constant && node.vValue) {
        const nodeMutationInfo = this.newValues.get(node.name);
        if (nodeMutationInfo) {
          node.vValue.value = nodeMutationInfo.value;
        }
      }
    });

    const mutatedSourceCode = writer.write(sourceUnit);
    sources[fileName].content = mutatedSourceCode;
    return sources;
  }
}
