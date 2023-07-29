import { ConstantMutation } from "./ConstantMutation";
import { HardhatAdapter } from "./HardhatAdapter";
import { HardhatRuntimeEnvironment } from "./types";

export class ConstantMutationHardhat extends ConstantMutation {
  constructor(hre: HardhatRuntimeEnvironment, contractName: string) {
    super(new HardhatAdapter(hre), contractName);
  }
}
