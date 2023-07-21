export interface HardhatRuntimeEnvironment {
  config: {
    paths: {
      root: string;
      sources: string;
    };
  };
}

export interface Paths {
  root: string;
  sources: string;
}

export interface CompilationInput {
  language: "Solidity";
  sources: CompilationInputSources;
  settings: { outputSelection: unknown };
}

export type CompilationInputSources = Record<string, { content: string }>;

export interface CompilationOutput {
  abi: string;
  evm: {
    bytecode: unknown;
  };
}

export interface CompilationMap {
  contracts: Record<string, Record<string, CompilationOutput>>;
}

export interface CompilationInputProvider {
  provide(): CompilationInput;
}

export interface Compilator {
  compile(input: CompilationInput): CompilationMap | null | undefined;
}

export interface Mutation {
  contractName: string;
  mutate(
    sources: CompilationInputSources
  ): Promise<CompilationInputSources | null | undefined>;
}

export interface FileSystemStat {
  isDirectory(): boolean;
  isFile(): boolean;
}
