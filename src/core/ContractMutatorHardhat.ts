import { CompilationInputProviderSolidity } from "./CompilationInputProviderSolidity";
import { CompilatorSolidity } from "./CompilatorSolidity";
import { ContractMutator } from "./ContractMutator";
import { HardhatAdapter } from "./HardhatAdapter";
import type { HardhatRuntimeEnvironment } from "./types";

export class ContractMutatorHardhat extends ContractMutator {
  constructor(hre: HardhatRuntimeEnvironment) {
    const adapter = new HardhatAdapter(hre);
    super(
      new CompilationInputProviderSolidity(adapter),
      new CompilatorSolidity(adapter)
    );
  }
}
