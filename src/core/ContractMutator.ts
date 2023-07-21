import { getContractFileName } from "../utils/file";
import { Lazy } from "../utils/lazy";
import { MutationError } from "./Errors";
import type {
  CompilationInput,
  CompilationInputProvider,
  CompilationOutput,
  Mutation,
  Compilator,
  CompilationMap,
} from "./types";

function extractCompilationOutput(
  compilationMap: CompilationMap,
  contractName: string
): CompilationOutput | null | undefined {
  if (!compilationMap || !compilationMap.contracts) {
    return null;
  }

  const contractFileName = getContractFileName(contractName);
  const fileCompilationOutput = compilationMap.contracts[contractFileName];
  if (!fileCompilationOutput) {
    return null;
  }

  const contractCompilationOutput = fileCompilationOutput[contractName];
  if (!contractCompilationOutput) {
    return null;
  }

  return {
    abi: contractCompilationOutput.abi,
    evm: {
      bytecode: contractCompilationOutput.evm.bytecode,
    },
  };
}

export class ContractMutator {
  private readonly compilationInput: Lazy<CompilationInput>;
  private readonly compilator: Compilator;

  constructor(provider: CompilationInputProvider, compilator: Compilator) {
    this.compilator = compilator;
    this.compilationInput = new Lazy<CompilationInput>(() =>
      provider.provide()
    );
  }

  async mutate(mutation: Mutation): Promise<CompilationOutput> {
    const compilationInput = this.compilationInput.value;
    const mutatedCompilationInputSources = await mutation.mutate(
      compilationInput.sources
    );
    if (!mutatedCompilationInputSources) {
      throw new MutationError();
    }
    compilationInput.sources = mutatedCompilationInputSources;
    const compilationMap = this.compilator.compile(compilationInput);
    if (!compilationMap) {
      throw new MutationError();
    }
    const compilationOutput = extractCompilationOutput(
      compilationMap,
      mutation.contractName
    );
    if (!compilationOutput) {
      throw new MutationError();
    }
    return compilationOutput;
  }
}
